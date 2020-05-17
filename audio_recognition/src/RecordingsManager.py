from collections import defaultdict
from typing import List, DefaultDict, Dict
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
                             recording.start_timestamp + segment.start_timestamp * 1000,
                             recording.start_timestamp + segment.end_timestamp * 1000)

    def getLength(self):
        return self.end_timestamp - self.start_timestamp


class Interruption:
    def __init__(self, recordingManager: "RecordingManager",
                 start_timestamp: int, end_timestamp: int,
                 from_user: User, to_user: User):
        self.start_timestamp = start_timestamp
        self.end_timestamp = end_timestamp
        self.from_user = from_user
        self.to_user = to_user
        self.recording_id = recordingManager.getAudio(start_timestamp, end_timestamp)


def printInt(data):
    print(f"IntJeMint: ({data.start_timestamp} - {data.end_timestamp}) | "
          f"{data.from_user.name} INTERUPTED {data.to_user.name} | redId: {data.recording_id}")


class RecordingManager:
    users: Dict[str, User] = {}
    recordings: DefaultDict[str, List[Recording]] = defaultdict(list)
    recording_parts_with_voice: DefaultDict[str, List[RecordingPart]] = defaultdict(list)
    interruptions: List[Interruption] = []  # Jahoda()  #

    def __init__(self, recordingsFolder: str):
        self.recordingsFolder = recordingsFolder

    def newRecording(self, rec: Recording):
        """
        Add new Recording clip to the Manager.
        """
        self.recordings[rec.user.id].append(rec)
        self.recordings[rec.user.id] = self.recordings[rec.user.id][-10:]

        if not self.users.get(rec.user.id):
            self.users[rec.user.id] = rec.user

        segmentsWithVoice = detect_human_voice(rec.audio, rec.sample_rate)
        partsWithVoice = [RecordingPart.fromSegment(rec, part) for part in segmentsWithVoice]
        self.recording_parts_with_voice[rec.user.id].extend(partsWithVoice)
        self.recording_parts_with_voice[rec.user.id] = self.recording_parts_with_voice[rec.user.id][-50:]

        self.users[rec.user.id].speak_time += sum([r.getLength() for r in partsWithVoice])

        # Check interruptions
        for new_part in partsWithVoice:
            for old_part in self.__getOtherUsersRecordingParts(rec.user.id):
                if self.__getOverlap(new_part, old_part) > 100:
                    start = max(0, min(new_part.start_timestamp, old_part.start_timestamp) - 2000)
                    end = max(new_part.end_timestamp, old_part.end_timestamp) + 2000
                    if old_part.start_timestamp < new_part.start_timestamp:
                        interruption = Interruption(self, start, end, new_part.recording.user, old_part.recording.user)
                        printInt(interruption)
                        self.interruptions.append(interruption)
                    else:
                        interruption = Interruption(self, start, end, old_part.recording.user, new_part.recording.user)
                        printInt(interruption)
                        self.interruptions.append(interruption)


    def __getOtherUsersRecordingParts(self, current_user_id: str) -> List[RecordingPart]:
        recordings = []
        for userId in self.recording_parts_with_voice:
            if userId != current_user_id:
                parts_with_voice = self.recording_parts_with_voice[userId][-10:]
                recordings.extend(parts_with_voice)
        return recordings


    def getAudio(self, start_timestamp: int, end_timestamp: int) -> str:
        """
        Combine recordings from some timestamp to one.
        :returns RecordingId
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
        combinedFrames: List[AudioSegment or None] = [None] * int((end_timestamp - start_timestamp) // 30 + 2)
        for recording in toCombine:
            for i, data in enumerate(recording):
                if not data:
                    continue
                audio = AudioSegment(data, sample_width=2, frame_rate=sampleRate, channels=1)
                if combinedFrames[i]:
                    combinedFrames[i] = combinedFrames[i].overlay(audio)
                else:
                    combinedFrames[i] = audio

        combinedFramesWithoutNones = [frame for frame in combinedFrames if frame is not None]
        if combinedFramesWithoutNones:
            finalAudio = combinedFramesWithoutNones[0]
            for i in range(1, len(combinedFramesWithoutNones)):
                if combinedFramesWithoutNones[i]:
                    finalAudio += combinedFramesWithoutNones[i]
        else:
            return ""

        # Save
        fileId = str(uuid4())
        filename = f"{fileId}.wav"
        finalAudio.export(f"{self.recordingsFolder}/jahoda/{filename}", format="wav")
        return fileId


    @staticmethod
    def __getFramesToInclude(recording: Recording, start_timestamp: int, end_timestamp: int) -> List[bytes or None]:
        includedFrames = [None] * int((recording.start_timestamp - start_timestamp) // 30)
        for frame in frame_generator(30, recording.audio, recording.sample_rate):
            frameTimestamp = recording.start_timestamp + frame.timestamp * 1000
            if start_timestamp < frameTimestamp < end_timestamp:
                if frameTimestamp >= recording.end_timestamp:
                    includedFrames.append(None)
                else:
                    includedFrames.append(frame.bytes)
        return includedFrames


    @staticmethod
    def __getOverlap(a: RecordingPart, b: RecordingPart):
        return max(0, min(a.end_timestamp, b.end_timestamp) - max(a.start_timestamp, b.start_timestamp))


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
