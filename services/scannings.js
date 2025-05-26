import axios from 'axios';
import { API_URL_IACOMISTE } from '@env';

export const uploadImage = async (imageUri) => {
  const formData = new FormData();
  const fileName = imageUri.split('/').pop() || 'photo.jpg';
  const fileType = fileName.split('.').pop();

  formData.append('file', {
    uri: imageUri,
    name: fileName,
    type: `image/${fileType}`,
  });

  const response = await axios.post(`${API_URL_IACOMISTE}/api/scannings/`, formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });

  return response.data.body;
};
