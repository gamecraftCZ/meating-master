from flask import Flask

from RecordingsManager import RecordingManager

app = Flask(__name__)

recordingManager = RecordingManager("../../_temp_audio")

# TODO create recording object and past it to the recording manager.
@app.route('/newRecording')
def newRecording():
   pass


if __name__ == '__main__':
   app.run()
