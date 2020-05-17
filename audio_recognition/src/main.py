from flask import Flask

from RecordingsManager import RecordingManager

app = Flask(__name__)

recordingManager = RecordingManager()

@app.route('/newRecording')
def newRecording():


if __name__ == '__main__':
   app.run()
