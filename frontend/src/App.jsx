import React, { useState } from 'react';
import UploadStep from './components/UploadStep';
import ResultStep from './components/ResultStep';
import { postPredict } from './api';
import './styles.css';

// Application states
const STEPS = {
  UPLOAD: 'upload',
  LOADING: 'loading',
  RESULT: 'result'
};

/**
 * Main application component
 */
function App() {
  // State management
  const [step, setStep] = useState(STEPS.UPLOAD);
  const [file, setFile] = useState(null);
  const [imageUrl, setImageUrl] = useState("");
  const [error, setError] = useState("");

  /**
   * Handle file selection
   */
  const handleFileSelect = (selectedFile) => {
    setFile(selectedFile);
    setError("");
  };

  /**
   * Handle analyze button click
   */
  const handleAnalyze = async () => {
    if (!file) return;
    
    try {
      setStep(STEPS.LOADING);
      
      // Call API to analyze the image
      const resultBlob = await postPredict(file);
      
      // Create a URL for the result image
      const url = URL.createObjectURL(resultBlob);
      setImageUrl(url);
      
      // Show the result
      setStep(STEPS.RESULT);
    } catch (err) {
      console.error("Analysis failed:", err);
      setError("Failed to analyze the image. Please try again.");
      setStep(STEPS.UPLOAD);
    }
  };

  /**
   * Reset the application state
   */
  const handleReset = () => {
    // Revoke object URL to prevent memory leaks
    if (imageUrl) {
      URL.revokeObjectURL(imageUrl);
    }
    
    // Reset all state
    setFile(null);
    setImageUrl("");
    setError("");
    setStep(STEPS.UPLOAD);
  };

  // Render appropriate step based on current state
  const renderStep = () => {
    switch (step) {
      case STEPS.LOADING:
        return (
          <div className="card loading">
            <div className="spinner"></div>
            <p>Analyzing your sheet music...</p>
          </div>
        );
        
      case STEPS.RESULT:
        return (
          <ResultStep 
            imageUrl={imageUrl} 
            onReset={handleReset} 
          />
        );
        
      case STEPS.UPLOAD:
      default:
        return (
          <UploadStep 
            onFileSelect={handleFileSelect} 
            onAnalyze={handleAnalyze} 
          />
        );
    }
  };

  return (
    <div className="container">
      {error && <div className="error-message">{error}</div>}
      {renderStep()}
    </div>
  );
}

export default App;