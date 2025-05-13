from flask import Flask, jsonify
from threading import Thread
app = Flask(__name__)
detection_running = False

@app.route("/start-detection", methods=["GET"])
def start_detection():
    global detection_running
    if not detection_running:
        detection_running = True
        Thread(target=run_detection).start()
        return jsonify({"status": "Cheating detection started"}), 200
    else:
        return jsonify({"status": "Detection already running"}), 400

@app.route("/")
def home():
    return "Cheating Detection API is running."

if __name__ == "__main__":
    app.run(debug=True,port=7000)