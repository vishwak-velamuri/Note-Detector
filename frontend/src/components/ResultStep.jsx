import React from 'react';
import ResetButton from './ResetButton';
import logo from '../assets/logo.svg';

/**
 * Component for displaying the results of note detection
 */
const ResultStep = ({ imageUrl, onReset }) => {
  // Create a download link for the annotated image
  const handleDownload = () => {
    const link = document.createElement('a');
    link.href = imageUrl;
    link.download = 'annotated_sheet_music.jpg';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="result-container">
      <img src={logo} alt="Don't Fret It Logo" className="logo" />
      
      <h2>Note Detection Complete</h2>
      
      <img 
        src={imageUrl} 
        alt="Annotated Sheet Music" 
        className="result-image"
      />
      
      <div className="btn-group">
        <button 
          className="btn btn-primary"
          onClick={handleDownload}
        >
          Download
        </button>
        <ResetButton onReset={onReset} />
      </div>
    </div>
  );
};

export default ResultStep;