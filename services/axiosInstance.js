import axios from 'axios';
import { API_URL_IACOMISTE } from '@env';

console.log("valor de env: ", API_URL_IACOMISTE);
const IAcomisteApi = axios.create({
  baseURL: API_URL_IACOMISTE,
  timeout: 5000,
  headers: {
    'Content-Type': 'application/json',
  },
});

export default IAcomisteApi;