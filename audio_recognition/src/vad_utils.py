import collections
import contextlib
import sys
import wave
from typing import List

import webrtcvad


# Inspiration: https://github.com/wiseman/py-webrtcvad/blob/master/example.py


def read_wave(path) -> (bytes, int):
    """Reads a .wav file.
    Takes the path, and returns (PCM audio data, sample rate).
    :returns (data, sample_rate)
    """
    with contextlib.closing(wave.open(path, 'rb')) as wf:
        num_channels = wf.getnchannels()
        assert num_channels == 1
        sample_width = wf.getsampwidth()
        assert sample_width == 2
        sample_rate = wf.getframerate()
        assert sample_rate in (8000, 16000, 32000, 48000)
        pcm_data = wf.readframes(wf.getnframes())
        return pcm_data, sample_rate


def write_wave(path, audio, sample_rate):
    """Writes a .wav file.
    Takes path, PCM audio data, and sample rate.
    """
    with contextlib.closing(wave.open(path, 'wb')) as wf:
        wf.setnchannels(1)
        wf.setsampwidth(2)
        wf.setframerate(sample_rate)
        wf.writeframes(audio)


class Frame(object):
    """Represents a "frame" of audio data."""

    def __init__(self, bytes, timestamp, duration):
        self.bytes = bytes
        self.timestamp = timestamp
        self.duration = duration


def frame_generator(frame_duration_ms, audio, sample_rate):
    """Generates audio frames from PCM audio data.
    Takes the desired frame duration in milliseconds, the PCM data, and
    the sample rate.
    Yields Frames of the requested duration.
    """
    n = int(sample_rate * (frame_duration_ms / 1000.0) * 2)
    offset = 0
    timestamp = 0.0
    duration = (float(n) / sample_rate) / 2.0
    while offset + n < len(audio):
        yield Frame(audio[offset:offset + n], timestamp, duration)
        timestamp += duration
        offset += n


class Segment(object):
    def __init__(self, data: bytes, start_timestamp: int, end_timestamp: int):
        self.data = data
        self.start_timestamp = start_timestamp
        self.end_timestamp = end_timestamp


def vad_collector(sample_rate, frame_duration_ms,
                  padding_duration_ms, vad, frames):
    """Filters out non-voiced audio frames.
    Given a webrtcvad.Vad and a source of audio frames, yields only
    the voiced audio.
    Uses a padded, sliding window algorithm over the audio frames.
    When more than 90% of the frames in the window are voiced (as
    reported by the VAD), the collector triggers and begins yielding
    audio frames. Then the collector waits until 90% of the frames in
    the window are unvoiced to detrigger.
    The window is padded at the front and back to provide a small
    amount of silence or the beginnings/endings of speech around the
    voiced frames.
    Arguments:
    sample_rate - The audio sample rate, in Hz.
    frame_duration_ms - The frame duration in milliseconds.
    padding_duration_ms - The amount to pad the window, in milliseconds.
    vad - An instance of webrtcvad.Vad.
    frames - a source of audio frames (sequence or generator).
    Returns: A generator that yields PCM audio data.
    """
    num_padding_frames = int(padding_duration_ms / frame_duration_ms)
    # We use a deque for our sliding window/ring buffer.
    ring_buffer = collections.deque(maxlen=num_padding_frames)
    # We have two states: TRIGGERED and NOTTRIGGERED. We start in the
    # NOTTRIGGERED state.
    triggered = False

    voiced_frames = []
    start_timestamp = 0
    for frame in frames:
        is_speech = vad.is_speech(frame.bytes, sample_rate)

        # sys.stdout.write('1' if is_speech else '0')
        if not triggered:
            ring_buffer.append((frame, is_speech))
            num_voiced = len([f for f, speech in ring_buffer if speech])
            # If we're NOTTRIGGERED and more than 90% of the frames in
            # the ring buffer are voiced frames, then enter the
            # TRIGGERED state.
            if num_voiced > 0.9 * ring_buffer.maxlen:
                triggered = True
                start_timestamp = frame.timestamp
                # sys.stdout.write('+(%s)' % (ring_buffer[0][0].timestamp,))
                # We want to yield all the audio we see from now until
                # we are NOTTRIGGERED, but we have to start with the
                # audio that's already in the ring buffer.
                for f, s in ring_buffer:
                    voiced_frames.append(f)
                ring_buffer.clear()
        else:
            # We're in the TRIGGERED state, so collect the audio data
            # and add it to the ring buffer.
            voiced_frames.append(frame)
            ring_buffer.append((frame, is_speech))
            num_unvoiced = len([f for f, speech in ring_buffer if not speech])
            # If more than 90% of the frames in the ring buffer are
            # unvoiced, then enter NOTTRIGGERED and yield whatever
            # audio we've collected.
            if num_unvoiced > 0.9 * ring_buffer.maxlen:
                # sys.stdout.write('-(%s)' % (frame.timestamp + frame.duration))
                triggered = False
                yield Segment(b''.join([f.bytes for f in voiced_frames]),
                              start_timestamp, frame.timestamp + frame.duration)
                ring_buffer.clear()
                voiced_frames = []
    # if triggered:
    #     sys.stdout.write('-(%s)' % (frame.timestamp + frame.duration))
    # sys.stdout.write('\n')
    # If we have any leftover voiced audio when we run out of input,
    # yield it.
    if voiced_frames:
        yield Segment(b''.join([f.bytes for f in voiced_frames]), start_timestamp, frame.timestamp + frame.duration)


def detect_human_voice(audio: bytes, sample_rate: int) -> List[Segment]:
    vad = webrtcvad.Vad(3)
    frames = list(frame_generator(30, audio, sample_rate))
    segments = vad_collector(sample_rate, 30, 300, vad, frames)
    return list(segments)


def detect_human_voice_from_file(filename: str) -> List[Segment]:
    audio, sample_rate = read_wave(filename)
    return detect_human_voice(audio, sample_rate)


# Example: extract all the parts, where voice is present
def main(args):
    if len(args) != 1:
        sys.stderr.write(
            'Only Example! - Usage: vad_utils.py <path to wav file>\n')
        sys.exit(1)
    _, sample_rate = read_wave(args[0])
    for segment in detect_human_voice(args[0]):
        path = '../testing_data/frames/chunk_%002.1d-%002.1d.wav' % (
            segment.start_timestamp, segment.end_timestamp)
        print(' Writing %s' % (path,))
        write_wave(path, segment.data, sample_rate)


if __name__ == '__main__':
    main(sys.argv[1:])
