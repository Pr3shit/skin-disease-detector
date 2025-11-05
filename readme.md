# 🩺 Skin Disease Detector

A machine learning–based project that detects common skin diseases from images.  
The core of the project is a *deep learning model* trained in a Jupyter Notebook (skin-disease-detection-final.ipynb),  
while the other files provide a simple full-stack web interface to upload images and view predictions.

---

## 📘 Overview

This project demonstrates how computer vision and deep learning can assist in early identification of skin diseases.  
The *model training and evaluation* is done in Python using TensorFlow/Keras inside the notebook,  
and a lightweight web setup is provided for testing the trained model:

- *Flask API (Python)* — serves the trained model for inference  
- *Node.js + Express* — backend middleware connecting frontend and Flask  
- *React.js* — simple UI for image upload and displaying predictions  

---

## 🧠 Features

- 🩻 Image-based disease classification using a CNN model  
- ⚙ Flask API for model inference  
- 🖥 React frontend for image upload and result display  
- 🌐 Full-stack integration (frontend + backend + API)  
- 🔒 Modular, easily extendable design  

---

## 🏗 Project Structure

bash
skin-disease-detector/
│
├── client/ # React frontend (UI)
│ ├── src/
│ ├── public/
│ └── package.json
│
├── server/ # Node.js backend
│ ├── routes/
│ ├── index.js
│ ├── package.json
│ └── .env.example
│
├── flaskapi/ # Flask API for ML model
│ ├── flaskapi.py
│ ├── requirements.txt
│ ├── model/ or bestmodel2.h5
│ └── uploads/
│
├── skin-disease-detection-final.ipynb # Model training notebook
└── Readme.md


---

## ⚙ Setup and Usage

### 🔹 1. Clone the repository
bash
git clone https://github.com/HarshitJain1303/skin-disease-detector.git
cd skin-disease-detector

### 🔹 2. Run the Flask API
bash
cd flaskapi
pip install -r requirements.txt
python flaskapi.py

Runs on http://localhost:5001

### 🔹 3. Run the Node.js backend
bash
cd ../server
npm install
npm start

Runs on http://localhost:5000

### 🔹 4. Run the React frontend
bash
cd ../client
npm install
npm start

Runs on http://localhost:3000

---

## 🧪 Model Training

The main deep learning model is implemented in:

📄 **skin-disease-detection-final.ipynb**

You can open it in *Jupyter Notebook* or *Google Colab* to:
- Load and preprocess the dataset  
- Train and evaluate the CNN model  
- Save the trained weights (.h5 file)  
- Export the model for Flask deployment  

---

## 🧰 Technologies Used

| Layer | Tools / Frameworks |
|-------|--------------------|
| *Model* | Python, TensorFlow / Keras, NumPy, Pandas, OpenCV |
| *API* | Flask |
| *Backend* | Node.js, Express, Axios, Multer |
| *Frontend* | React.js, HTML, CSS |
| *Environment* | Git, VS Code |

---

## 🧩 Future Improvements

- Add more disease categories and dataset diversity  
- Improve model accuracy and interpretability  

---

## ⚠ Disclaimer

This project is for *educational and research purposes only*.  
Predictions are not a substitute for professional medical advice or diagnosis.

---

### ⭐ If you found this project helpful
Give it a *star* on GitHub! 🌟

---
