import axios from 'axios';

let loadingCount = 0;

const setLoading = (loading) => {
  if (window.setGlobalLoading) {
    window.setGlobalLoading(loading);
  }
};

axios.interceptors.request.use(
  (config) => {
    loadingCount++;
    if (loadingCount === 1) setLoading(true);
    return config;
  },
  (error) => {
    loadingCount = Math.max(0, loadingCount - 1);
    if (loadingCount === 0) setLoading(false);
    return Promise.reject(error);
  }
);

axios.interceptors.response.use(
  (response) => {
    loadingCount = Math.max(0, loadingCount - 1);
    if (loadingCount === 0) setLoading(false);
    return response;
  },
  (error) => {
    loadingCount = Math.max(0, loadingCount - 1);
    if (loadingCount === 0) setLoading(false);
    return Promise.reject(error);
  }
);

export default axios; 