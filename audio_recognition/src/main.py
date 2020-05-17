import json
import os
from time import time

from flask import Flask, request, send_file, abort

from RecordingsManager import RecordingManager
from RecordingsManager import User, Recording
from vad_utils import read_pcm


def is_safe_path(basedir, path, follow_symlinks=True):
    # resolves symbolic links
    if follow_symlinks:
        return os.path.realpath(path).startswith(basedir)

    return os.path.abspath(path).startswith(basedir)


app = Flask(__name__)

recordingManager = RecordingManager("../../_temp_audio")

meetingStart = None
meetingEnd = None
@app.route('/startMeeting', methods=["POST"])
def startMeeting():
    global meetingStart
    global meetingEnd
    meetingStart = time()
    meetingEnd = None
    return "Ahoj Ondro"

@app.route('/endMeeting', methods=["POST"])
def endMeeting():
    global meetingStart
    global meetingEnd
    meetingEnd = time()
    return "Okajda, Kokajda"

@app.route('/pobodamVlckovou', methods=["GET", "POST"])
def clearMeeting():
    print("POBODAM!")
    global recordingManager
    global meetingStart
    global meetingEnd
    recordingManager = RecordingManager(recordingManager.recordingsFolder)
    meetingStart = 0
    meetingEnd = 0
    return "OK"


@app.route('/newRecording', methods=["POST"])
def newRecording():
    global recordingManager
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
    global recordingManager
    meeting_length = int(((meetingEnd or time()) - (meetingStart or time())) * 1000)
    if len(recordingManager.users.values()) > 0 and type(meeting_length) == int:
        optimal_speaking_time = meeting_length / len(recordingManager.users.keys())
    else:
        optimal_speaking_time = 0
    return app.response_class(
        response=json.dumps({
            "meeting_length": meeting_length or None,
            "optimal_meeting_time": optimal_speaking_time or None,
            "users": [{"name": u.name, "id": u.id, "talkTime": u.speak_time}
                      for u in recordingManager.users.values()],
            "interruptions":
                [{
                    "from": {
                        "id": i.from_user.id,
                        "name": i.from_user.name
                    },
                    "to": {
                        "id": i.to_user.id,
                        "name": i.to_user.name
                    },
                    "recordingId": i.recording_id,
                    "startTimestamp": i.start_timestamp,
                    "endTimestamp": i.end_timestamp
                } for i in recordingManager.interruptions]
        }),
        status=200,
        mimetype='application/json'
    )


@app.route('/recordings/<recordingId>', methods=["GET"])
def getRecording(recordingId: str):
    global recordingManager
    if is_safe_path(os.path.abspath(recordingManager.recordingsFolder),
                    f'{os.path.abspath(recordingManager.recordingsFolder)}/{recordingId}.wav'):
        try:
            return send_file(f'{recordingManager.recordingsFolder}/jahoda/{recordingId}.wav')
        except FileNotFoundError:
            abort(404)
    else:
        return '<meta http-equiv="Refresh" content="0"; url="https://www.youtube.com/watch?v=oHg5SJYRHA0" />'


if __name__ == '__main__':
    app.run(port=2986, host="0.0.0.0")
