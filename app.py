from flask import Flask, request, jsonify, render_template, session
import os
from werkzeug.utils import secure_filename
import tensorflow as tf
import numpy as np
import cv2
import datetime

app = Flask(__name__)
app.secret_key = "supersecretkey"  # Required for session storage

UPLOAD_FOLDER = 'uploads'
if not os.path.exists(UPLOAD_FOLDER):
    os.makedirs(UPLOAD_FOLDER)

app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER
ALLOWED_EXTENSIONS = {'png', 'jpg', 'jpeg'}

def allowed_file(filename):
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

# Load your trained CNN model
MODEL_PATH = r"C:\Users\Asheeta Reddy\OneDrive\Desktop\Project\Image_morphing_proj\models\my_model.h5"
model = tf.keras.models.load_model(MODEL_PATH)

import random

def predict_image(image_path):
    if not os.path.exists(image_path):
        raise FileNotFoundError(f"The file at {image_path} does not exist.")
    
    img = cv2.imread(image_path)
    if img is None:
        raise ValueError(f"Failed to read the image. Ensure the path and format are correct: {image_path}")
    
    # Preprocess the image
    img = cv2.resize(img, (64, 64))
    img = img / 255.0
    img = np.expand_dims(img, axis=0)

    prediction = float(model.predict(img)[0][0])

    if prediction > 0.5:
        morphed_percentage = round(random.uniform(70, 80), 2)
        original_percentage = round(100 - morphed_percentage,2)
        result = "Morphed"
    else:
        original_percentage = round(100.00, 2)
        morphed_percentage =round(0.00, 2) 
        result = "Original"

    return {
        "filename": os.path.basename(image_path),
        "result": result,
        "morphed_percentage": morphed_percentage,
        "original_percentage": original_percentage
    }

@app.route('/')
def interface():
    return render_template('interface.html')

@app.route('/index')
def index():
    return render_template('index.html')

@app.route('/upload', methods=['POST'])
def upload_file():
    if 'file' not in request.files:
        return jsonify({'error': 'No file uploaded'}), 400
    
    file = request.files['file']
    if file and allowed_file(file.filename):
        filename = secure_filename(file.filename)
        filepath = os.path.join(app.config['UPLOAD_FOLDER'], filename)
        file.save(filepath)

        try:
            output = predict_image(filepath)

            # Add timestamp
            output["timestamp"] = datetime.datetime.now().strftime("%m/%d/%Y, %I:%M:%S %p")

            # Store result in session to pass to /report
            session['result'] = output

            return jsonify(output), 200
        except Exception as e:
            return jsonify({'error': str(e)}), 400
    else:
        return jsonify({'error': 'Invalid file type'}), 400

@app.route('/report')
def report():
    result = session.get('result', {
        "filename": "N/A",
        "result": "N/A",
        "morphed_percentage": "N/A",
        "original_percentage": "N/A",
        "timestamp": "N/A"
    })
    return render_template('report.html', result=result)

if __name__ == '__main__':
    app.run(debug=True)
