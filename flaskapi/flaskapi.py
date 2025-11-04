

from flask import Flask, request, jsonify
from tensorflow.keras.models import load_model
from tensorflow.keras.preprocessing import image
from tensorflow.keras.applications.efficientnet import preprocess_input
import numpy as np
from PIL import Image, UnidentifiedImageError
import io, json
from flask_cors import CORS
import os

# --- Initialize Flask app ---
app = Flask(__name__)
app.config['MAX_CONTENT_LENGTH'] = 50 * 1024 * 1024  # Allow up to 50MB uploads
CORS(app)

# --- Load the fine-tuned model ---
MODEL_PATH = "bestmodel2.h5"
model = load_model(MODEL_PATH)

# --- Class names (same order as training) ---
CLASS_NAMES = [
    "Eczema",
    "Warts Molluscum and other Viral Infections",
    "Melanoma",
    "Atopic Dermatitis",
    "Basal Cell Carcinoma",
    "Melanocytic Nevi",
    "Benign Keratosis-like Lesions",
    "Psoriasis / Lichen Planus and related diseases",
    "Seborrheic Keratoses and other Benign Tumors",
    "Tinea / Ringworm / Candidiasis and other Fungal Infections"
]

# --- Load Disease Information ---
DISEASE_INFO_PATH = "disease_info.json"
if os.path.exists(DISEASE_INFO_PATH):
    with open(DISEASE_INFO_PATH, "r", encoding="utf-8") as f:
        DISEASE_INFO = json.load(f)
else:
    DISEASE_INFO = {}

# --- Prediction route ---
@app.route("/predict", methods=["POST"])
def predict():
    try:
        #  Check if image is present
        if 'image' not in request.files:
            print("❌ No image in request.files")
            return jsonify({'error': 'No image file provided'}), 400

        # Read the image safely
        file = request.files['image']
        img_bytes = file.read()
        try:
            img = Image.open(io.BytesIO(img_bytes)).convert("RGB")
        except UnidentifiedImageError:
            print("❌ Invalid image data")
            return jsonify({'error': 'Invalid image file'}), 400

        # Preprocess (same as before — do NOT modify)
        img = img.resize((256, 256))
        img_array = np.array(img, dtype=np.float32)
        img_array = np.expand_dims(img_array, axis=0)
        img_array = preprocess_input(img_array)

        # Model Prediction
        preds = model.predict(img_array)
        class_idx = int(np.argmax(preds[0]))
        predicted_class = CLASS_NAMES[class_idx]
        confidence = round(float(np.max(preds[0])) * 100, 2)

        print(f"✅ Prediction: {predicted_class} ({confidence}%)")

        # Attach extra disease info (symptoms, remedy, recommendations)
        info = DISEASE_INFO.get(predicted_class, {
            "symptoms": ["Information not available"],
            "remedy": ["Information not available"],
            "recommendations": ["Information not available"]
        })

        # Return full JSON response
        return jsonify({
            "predicted_class": predicted_class,
            "confidence": confidence,
            "details": info
        })

    except Exception as e:
        print(" Flask error:", str(e))
        return jsonify({'error': str(e)}), 500


# --- Run Flask app ---
if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5001, debug=True)
