import apiClient from '../helpers/apiClient';

export const uploadCsv = async (file) => {
  try {
    const formData = new FormData();
    formData.append('file', file); // Use 'file' (matching the FastAPI endpoint)

    const response = await apiClient.post('/upload-csv/', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });

    // Return the extracted data from the single file upload response.
    return response.data.data;
  } catch (error) {
    console.error('Error uploading CSV:', error);
    throw error;
  }
};
