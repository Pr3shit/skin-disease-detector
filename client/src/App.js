
import React, { useState } from 'react';
import { Upload, AlertCircle, CheckCircle, Loader, X, FileImage } from 'lucide-react';
import './App.css';

function App() {
  const [selectedImage, setSelectedImage] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);
  const PREDICT_API = process.env.REACT_APP_PREDICT_API;

  const handleImageSelect = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (!file.type.startsWith('image/')) {
        setError('Please select a valid image file');
        return;
      }
      setSelectedImage(file);
      setPreviewUrl(URL.createObjectURL(file));
      setResult(null);
      setError(null);
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const handleDrop = (e) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file && file.type.startsWith('image/')) {
      setSelectedImage(file);
      setPreviewUrl(URL.createObjectURL(file));
      setResult(null);
      setError(null);
    }
  };

  const handleUpload = async () => {
    if (!selectedImage) {
      setError('Please select an image first');
      return;
    }

    setLoading(true);
    setError(null);

    const formData = new FormData();
    formData.append('image', selectedImage);

    try {
      const response = await fetch(`${PREDICT_API}/predict`, {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();

      if (data.success) {
        setResult(data);
      } else {
        setError(data.error || 'Prediction failed');
      }
    } catch (err) {
      setError('Failed to connect to server. Please ensure the backend is running.');
      console.error('Upload error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setSelectedImage(null);
    setPreviewUrl(null);
    setResult(null);
    setError(null);
  };

  const getConfidenceClass = (confidence) => {
    if (confidence >= 80) return 'confidence-high';
    if (confidence >= 60) return 'confidence-medium';
    return 'confidence-low';
  };

  return (
    <div className="detector-container">
      <div className="detector-wrapper">
        {/* Header */}
        <div className="detector-header">
          <h1 className="detector-title">Skin Disease Detection</h1>
          <p className="detector-subtitle">
            Upload an image to detect and identify skin conditions using AI
          </p>
        </div>

        <div className="detector-grid">
          {/* Upload Section */}
          <div className="detector-card">
            <h2 className="card-title">Upload Image</h2>

            {!previewUrl ? (
              <div
                onDragOver={handleDragOver}
                onDrop={handleDrop}
                className="upload-zone"
                onClick={() => document.getElementById('fileInput').click()}
              >
                <Upload className="upload-icon" />
                <p className="upload-text-primary">
                  Click to upload or drag and drop
                </p>
                <p className="upload-text-secondary">
                  PNG, JPG, JPEG up to 10MB
                </p>
                <input
                  id="fileInput"
                  type="file"
                  accept="image/*"
                  onChange={handleImageSelect}
                  className="file-input"
                />
              </div>
            ) : (
              <div className="preview-container">
                <img
                  src={previewUrl}
                  alt="Preview"
                  className="preview-image"
                />
                <button
                  onClick={handleReset}
                  className="reset-button"
                >
                  <X className="reset-icon" />
                </button>
              </div>
            )}

            {previewUrl && (
              <button
                onClick={handleUpload}
                disabled={loading}
                className={`detect-button ${loading ? 'button-disabled' : ''}`}
              >
                {loading ? (
                  <>
                    <Loader className="button-icon loading-spin" />
                    Analyzing...
                  </>
                ) : (
                  <>
                    <CheckCircle className="button-icon" />
                    Detect Disease
                  </>
                )}
              </button>
            )}

            {error && (
              <div className="error-box">
                <AlertCircle className="error-icon" />
                <p className="error-text">{error}</p>
              </div>
            )}
          </div>

          {/* Results Section */}
          <div className="detector-card">
            <h2 className="card-title">Detection Results</h2>

            {!result ? (
              <div className="empty-state">
                <FileImage className="empty-icon" />
                <p className="empty-text-primary">No results yet</p>
                <p className="empty-text-secondary">Upload an image to get started</p>
              </div>
            ) : (
              <div className="results-container">
                {/* Predicted Disease */}
                <div className="disease-box">
                  <p className="disease-label">Detected Condition</p>
                  <h3 className="disease-name">
                    {result.predicted_class}
                  </h3>
                </div>

                {/* Confidence Score */}
                <div className={`confidence-box ${getConfidenceClass(result.confidence)}`}>
                  <p className="confidence-label">Confidence Level</p>
                  <div className="confidence-content">
                    <span className="confidence-percentage">
                      {result.confidence}%
                    </span>
                  </div>
                  <div className="progress-bar">
                    <div
                      className="progress-fill"
                      style={{ width: `${result.confidence}%` }}
                    />
                  </div>
                </div>

                {/* Details */}
                {result.details && (
                  <div className="details-container">
                    {/* Symptoms */}
                    {result.details.symptoms && result.details.symptoms.length > 0 && (
                      <div className="detail-box symptoms-box">
                        <h4 className="detail-title">
                          <span className="detail-bullet symptoms-bullet"></span>
                          Symptoms
                        </h4>
                        <ul className="detail-list">
                          {result.details.symptoms.map((symptom, idx) => (
                            <li key={idx} className="detail-item">
                              • {symptom}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {/* Remedy */}
                    {result.details.remedy && result.details.remedy.length > 0 && (
                      <div className="detail-box remedy-box">
                        <h4 className="detail-title">
                          <span className="detail-bullet remedy-bullet"></span>
                          Treatment Options
                        </h4>
                        <ul className="detail-list">
                          {result.details.remedy.map((remedy, idx) => (
                            <li key={idx} className="detail-item">
                              • {remedy}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {/* Recommendations */}
                    {result.details.recommendations && result.details.recommendations.length > 0 && (
                      <div className="detail-box recommendations-box">
                        <h4 className="detail-title">
                          <span className="detail-bullet recommendations-bullet"></span>
                          Recommendations
                        </h4>
                        <ul className="detail-list">
                          {result.details.recommendations.map((rec, idx) => (
                            <li key={idx} className="detail-item">
                              • {rec}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                )}

                {/* Disclaimer */}
                <div className="disclaimer-box">
                  <p className="disclaimer-text">
                    <strong>Disclaimer:</strong> This is an AI-powered tool and should not replace professional medical advice. Please consult a dermatologist for proper diagnosis and treatment.
                  </p>
                </div>

                <button
                  onClick={handleReset}
                  className="analyze-again-button"
                >
                  Analyze Another Image
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Info Section */}
        <div className="info-section">
          <h3 className="info-title">How it works</h3>
          <div className="info-grid">
            <div className="info-step">
              <div className="step-number">1</div>
              <div>
                <p className="step-title">Upload Image</p>
                <p className="step-description">Select a clear photo of the affected skin area</p>
              </div>
            </div>
            <div className="info-step">
              <div className="step-number">2</div>
              <div>
                <p className="step-title">AI Analysis</p>
                <p className="step-description">Our model analyzes the image for skin conditions</p>
              </div>
            </div>
            <div className="info-step">
              <div className="step-number">3</div>
              <div>
                <p className="step-title">Get Results</p>
                <p className="step-description">Receive detailed information and recommendations</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;