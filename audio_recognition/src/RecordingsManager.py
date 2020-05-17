from collections import defaultdict
from typing import List, DefaultDict
from uuid import uuid4

from pydub import AudioSegment

from vad_utils import detect_human_voice, Segment, frame_generator, read_pcm


class User:
    speak_time = 0
    def __init__(self, name: str, id: str):
        self.name = name
        self.id = id


class Recording:
    def __init__(self, audio: bytes, sample_rate: int, recording_id: str,
                 start_timestamp: int, end_timestamp: int, user: User):
        self.audio = audio
        self.sample_rate = sample_rate
        self.recording_id = recording_id
        self.start_timestamp = start_timestamp
        self.end_timestamp = end_timestamp
        self.user = user


class RecordingPart:
    def __init__(self, recording: Recording, start_timestamp: int, end_timestamp: int):
        self.recording = recording
        self.start_timestamp = start_timestamp
        self.end_timestamp = end_timestamp

    @staticmethod
    def fromSegment(recording: Recording, segment: Segment) -> "RecordingPart":
        return RecordingPart(recording,
                             recording.start_timestamp + segment.start_timestamp,
                             recording.start_timestamp + segment.end_timestamp)


class RecordingManager:
    recordings: DefaultDict[str, List[Recording]] = defaultdict(list)
    recording_parts_with_voice: DefaultDict[str, List[RecordingPart]] = defaultdict(list)

    def __init__(self, recordingsFolder: str):
        self.recordingsFolder = recordingsFolder

    def newRecording(self, rec: Recording):
        """
        Add new Recording clip to the Manager.
        """
        self.recordings[rec.user.id].append(rec)

        partsWithVoice = detect_human_voice(rec.audio, rec.sample_rate)
        self.recording_parts_with_voice[rec.user.id].extend(
            [RecordingPart.fromSegment(rec, part) for part in partsWithVoice])

    def getAudio(self, start_timestamp: int, end_timestamp: int) -> str:
        """
        Combine recordings from some timestamp to one.
        :returns CombinedFilename
        """
        toCombine = []
        sampleRate = 0
        for i in self.recordings:
            userRecordings = self.recordings[i]
            for recording in userRecordings:
                if recording.start_timestamp < end_timestamp and recording.end_timestamp >= start_timestamp:
                    toCombine.append(self.__getFramesToInclude(recording, start_timestamp, end_timestamp))
                    sampleRate = recording.sample_rate

        if not toCombine:
            return ""

        # Combine
        combinedFrames: List[AudioSegment or None] = [None] * ((end_timestamp - start_timestamp) // 30 + 2)
        for recording in toCombine:
            for i, data in enumerate(recording):
                if not data:
                    continue
                audio = AudioSegment(data, sample_width=2, frame_rate=sampleRate, channels=1)
                if combinedFrames[i]:
                    combinedFrames[i] = combinedFrames[i].overlay(audio)
                else:
                    combinedFrames[i] = audio

        if [frame for frame in combinedFrames if frame is not None]:
            finalAudio = combinedFrames[0]
            for i in range(1, len(combinedFrames)):
                if combinedFrames[i]:
                    finalAudio += combinedFrames[i]
        else:
            return ""

        # Save
        filename = f"{uuid4()}.wav"
        finalAudio.export(f"{self.recordingsFolder}/{filename}", format="wav")
        return f"{self.recordingsFolder}/{filename}"

    @staticmethod
    def __getFramesToInclude(recording: Recording, start_timestamp: int, end_timestamp: int) -> List[bytes or None]:
        includedFrames = [None] * ((recording.start_timestamp - start_timestamp) // 30)
        for frame in frame_generator(30, recording.audio, recording.sample_rate):
            frameTimestamp = recording.start_timestamp + frame.timestamp * 1000
            if start_timestamp < frameTimestamp < end_timestamp:
                if frameTimestamp >= recording.end_timestamp:
                    includedFrames.append(None)
                else:
                    includedFrames.append(frame.bytes)
        return includedFrames


# For testing purposes
if __name__ == '__main__':
    patrik = User("Patrik", "id-18-a")
    ondra = User("Ondra", "id-1-b")

    # audio, sample_rate = read_wave("../testing_data/test_audio.wav")
    audio, sample_rate = read_pcm("../../_temp_audio/6208e072-6d94-4c46-8b2f-7770e5c63520.pcm")
    recording_ondra = Recording(audio, sample_rate, "rec-O", 1_000, 15_000, ondra)

    # red, red_sample_rate = read_wave("../testing_data/red.wav")
    red, red_sample_rate = read_pcm("../../_temp_audio/df030484-7f55-4203-8e02-bd84430bcfef.pcm")
    recording_patrik = Recording(red, red_sample_rate, "rec-P", 10_000, 20_000, patrik)

    manager = RecordingManager("../testing_data/recordings")
    manager.newRecording(recording_patrik)
    manager.newRecording(recording_ondra)

    file = manager.getAudio(10_000, 20_000)
    print("combined file: ", file)
