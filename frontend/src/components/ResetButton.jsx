import React from 'react';

/**
 * Simple reset button component
 */
const ResetButton = ({ onReset }) => {
  return (
    <button 
      className="btn btn-secondary"
      onClick={onReset}
    >
      Start Over
    </button>
  );
};

export default ResetButton;