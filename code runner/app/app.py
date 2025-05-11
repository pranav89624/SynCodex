from flask import Flask, request, jsonify
import subprocess
import os
import uuid

app = Flask(__name__)

# Define a helper function to run code in a specific language
def run_code(language: str, code: str):
    # Create a unique folder to store the code and output
    temp_dir = f"/tmp/{uuid.uuid4()}"
    os.makedirs(temp_dir)
    
    file_path = f"{temp_dir}/code"
    
    if language == "python":
        file_path += ".py"
        with open(file_path, "w") as f:
            f.write(code)
        result = subprocess.run(["python3", file_path], capture_output=True, text=True)
        
    elif language == "c":
        file_path += ".c"
        with open(file_path, "w") as f:
            f.write(code)
        compile_result = subprocess.run(["gcc", file_path, "-o", f"{temp_dir}/a.out"], capture_output=True, text=True)
        if compile_result.returncode != 0:
            return compile_result.stdout + compile_result.stderr
        result = subprocess.run([f"{temp_dir}/a.out"], capture_output=True, text=True)
        
    elif language == "cpp":
        file_path += ".cpp"
        with open(file_path, "w") as f:
            f.write(code)
        compile_result = subprocess.run(["g++", file_path, "-o", f"{temp_dir}/a.out"], capture_output=True, text=True)
        if compile_result.returncode != 0:
            return compile_result.stdout + compile_result.stderr
        result = subprocess.run([f"{temp_dir}/a.out"], capture_output=True, text=True)
        
    elif language == "java":
        file_path += ".java"
        with open(file_path, "w") as f:
            f.write(code)
        compile_result = subprocess.run(["javac", file_path], capture_output=True, text=True)
        if compile_result.returncode != 0:
            return compile_result.stdout + compile_result.stderr
        result = subprocess.run(["java", "-cp", temp_dir, file_path.split("/")[-1].replace(".java", "")], capture_output=True, text=True)
        
    elif language == "js":
        file_path += ".js"
        with open(file_path, "w") as f:
            f.write(code)
        result = subprocess.run(["node", file_path], capture_output=True, text=True)
        
    elif language == "ts":
        file_path += ".ts"
        with open(file_path, "w") as f:
            f.write(code)
        # Compile the TypeScript code to JavaScript
        compile_result = subprocess.run(["tsc", file_path], capture_output=True, text=True)
        if compile_result.returncode != 0:
            return compile_result.stdout + compile_result.stderr
        result = subprocess.run(["node", file_path.replace(".ts", ".js")], capture_output=True, text=True)
        
    else:
        return "Unsupported language."

    # Clean up
    os.remove(file_path)
    if os.path.exists(f"{temp_dir}/a.out"):
        os.remove(f"{temp_dir}/a.out")

    return result.stdout + result.stderr


# Define the routes to run the code for each language

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
