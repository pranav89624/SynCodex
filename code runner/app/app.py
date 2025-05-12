from flask import Flask, request, jsonify
import subprocess
import os
import uuid
import re
from flask_cors import CORS

app = Flask(__name__)
CORS(app)  # Enable CORS for all routes

# Helper function to extract Java class name
def extract_java_class_name(code):
    match = re.search(r'public\s+class\s+(\w+)', code)
    return match.group(1) if match else "Main"

# Define a helper function to run code in a specific language
def run_code(language: str, code: str):
    temp_dir = f"/tmp/{uuid.uuid4()}"
    os.makedirs(temp_dir)
    
    if language == "java":
        class_name = extract_java_class_name(code)
        file_path = os.path.join(temp_dir, f"{class_name}.java")
    else:
        file_path = os.path.join(temp_dir, f"code.{language if language != 'cpp' else 'cpp'}")

    with open(file_path, "w") as f:
        f.write(code)

    try:
        if language == "python":
            result = subprocess.run(["python3", file_path], capture_output=True, text=True)

        elif language == "c":
            compile_result = subprocess.run(["gcc", file_path, "-o", f"{temp_dir}/a.out"], capture_output=True, text=True)
            if compile_result.returncode != 0:
                return compile_result.stdout + compile_result.stderr
            result = subprocess.run([f"{temp_dir}/a.out"], capture_output=True, text=True)

        elif language == "cpp":
            compile_result = subprocess.run(["g++", file_path, "-o", f"{temp_dir}/a.out"], capture_output=True, text=True)
            if compile_result.returncode != 0:
                return compile_result.stdout + compile_result.stderr
            result = subprocess.run([f"{temp_dir}/a.out"], capture_output=True, text=True)

        elif language == "java":
            compile_result = subprocess.run(["javac", file_path], capture_output=True, text=True)
            if compile_result.returncode != 0:
                return compile_result.stdout + compile_result.stderr
            result = subprocess.run(["java", "-cp", temp_dir, class_name], capture_output=True, text=True)

        elif language == "js":
            result = subprocess.run(["node", file_path], capture_output=True, text=True)

        elif language == "ts":
            compile_result = subprocess.run(["tsc", file_path], capture_output=True, text=True)
            if compile_result.returncode != 0:
                return compile_result.stdout + compile_result.stderr
            js_file = file_path.replace(".ts", ".js")
            result = subprocess.run(["node", js_file], capture_output=True, text=True)

        else:
            return "Unsupported language."

        return result.stdout + result.stderr

    finally:
        # Clean up temp files
        for f in os.listdir(temp_dir):
            try:
                os.remove(os.path.join(temp_dir, f))
            except:
                pass
        os.rmdir(temp_dir)

# Flask endpoints
@app.route("/run-python/", methods=["POST"])
def run_python():
    try:
        code = request.json.get("code")
        output = run_code("python", code)
        return jsonify({"output": output})
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route("/run-c/", methods=["POST"])
def run_c():
    try:
        code = request.json.get("code")
        output = run_code("c", code)
        return jsonify({"output": output})
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route("/run-cpp/", methods=["POST"])
def run_cpp():
    try:
        code = request.json.get("code")
        output = run_code("cpp", code)
        return jsonify({"output": output})
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route("/run-java/", methods=["POST"])
def run_java():
    try:
        code = request.json.get("code")
        output = run_code("java", code)
        return jsonify({"output": output})
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route("/run-js/", methods=["POST"])
def run_js():
    try:
        code = request.json.get("code")
        output = run_code("js", code)
        return jsonify({"output": output})
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route("/run-ts/", methods=["POST"])
def run_ts():
    try:
        code = request.json.get("code")
        output = run_code("ts", code)
        return jsonify({"output": output})
    except Exception as e:
        return jsonify({"error": str(e)}), 500

if __name__ == "__main__":
    app.run(debug=False, host="0.0.0.0", port=6000)
