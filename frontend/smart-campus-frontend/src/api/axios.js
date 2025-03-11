import axios from 'axios';

const instance = axios.create({
  baseURL: 'http://localhost:5000/api',  // Adjust base URL if needed
});

export default instance;
