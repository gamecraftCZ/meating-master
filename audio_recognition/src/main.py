import json

from flask import Flask, request
from RecordingsManager import RecordingManager, User, Recording
from vad_utils import read_pcm

app = Flask(__name__)

recordingManager = RecordingManager("../../_temp_audio")

@app.route('/newRecording', methods=["POST"])
def newRecording():
    data = json.loads(request.data)
    filepath = data["filepath"]
    recordingId = data["recordingId"]
    start_timestamp = data["startTimestamp"]
    end_timestamp = data["endTimestamp"]
    user = User(data["user"]["name"], data["user"]["id"])

    audio, sample_rate = read_pcm(filepath)
    rec = Recording(audio, sample_rate, recordingId, start_timestamp, end_timestamp, user)
    recordingManager.newRecording(rec)
    return "OK"



if __name__ == '__main__':
    app.run(port=2986)
