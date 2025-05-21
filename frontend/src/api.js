/**
 * API service for the Note Detector application
 * Handles communication with the FastAPI backend
 */

/**
 * Submits an image file to the prediction endpoint
 * @param {File} file - The image file to analyze
 * @returns {Promise<Blob>} - Promise resolving to image blob
 */
export const postPredict = async (file) => {
  try {
    const formData = new FormData();
    formData.append('file', file);

    const response = await fetch('/predict', {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`API Error (${response.status}): ${errorText}`);
    }

    // Return the image blob directly
    return await response.blob();
  } catch (error) {
    console.error('Prediction request failed:', error);
    throw error;
  }
}