import json

from flask import Flask, request
from RecordingsManager import RecordingManager, User, Recording
from vad_utils import read_pcm
from RecordingsManager import RecordingManager

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


@app.route('/getInfo', methods=["GET"])
def getInfo():
    return json.dumps({
        "users": [{"name": u.name, "id": u.id, "talkTime": u.speak_time}
                  for u in recordingManager.users.values()],
        # "interruptions":
        #     [{
        #         "from": {
        #             "id": i.from_user.id,
        #             "name": i.from_user.name
        #         },
        #         "to": {
        #             "id": i.to_user.id,
        #             "name": i.to_user.name
        #         },
        #         "recordingId": i.recording_id
        #     } for i in interruptions]
    })


if __name__ == '__main__':
    app.run(port=2986)
