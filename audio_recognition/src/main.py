import json

from flask import Flask

from RecordingsManager import RecordingManager
from interuptions import users, interruptions

app = Flask(__name__)

recordingManager = RecordingManager("../../_temp_audio")

# TODO create recording object and past it to the recording manager.
@app.route('/newRecording')
def newRecording():
   pass


@app.route('/getInfo')
def getInfo():
    return json.dumps({
        "users": [{
            {"name": u.name, "id": u.id, "talkTime": u.speak_time}
        } for u in users],
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
                "recordingId": i.recording_id
            } for i in interruptions]
    })


if __name__ == '__main__':
   app.run()
