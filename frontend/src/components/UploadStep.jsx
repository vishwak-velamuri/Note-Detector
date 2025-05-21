import React, { useRef, useState } from 'react';
import logo from '../assets/logo.svg';

/**
 * Component for the upload step of the application
 */
const UploadStep = ({ onFileSelect, onAnalyze }) => {
  const [fileName, setFileName] = useState('');
  const fileInputRef = useRef(null);

  /**
   * Handle file selection from input
   */
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFileName(file.name);
      onFileSelect(file);
    }
  };

  /**
   * Trigger file input click
   */
  const triggerFileInput = () => {
    fileInputRef.current.click();
  };

  return (
    <div className="card">
      <img src={logo} alt="Don't Fret It Logo" className="logo" />
      
      <div className="form-group">
        <label htmlFor="sheet-music" className="file-label" onClick={triggerFileInput}>
          <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
            <polyline points="17 8 12 3 7 8" />
            <line x1="12" y1="3" x2="12" y2="15" />
          </svg>
          <span>Choose Sheet Music</span>
          {fileName && <span className="file-name">{fileName}</span>}
        </label>
        
        <input
          type="file"
          id="sheet-music"
          ref={fileInputRef}
          className="file-input"
          accept=".png,.jpg,.jpeg"
          onChange={handleFileChange}
        />
      </div>
      
      <button 
        className="btn btn-primary"
        onClick={onAnalyze}
        disabled={!fileName}
      >
        Analyze
      </button>
    </div>
  );
};

export default UploadStep;