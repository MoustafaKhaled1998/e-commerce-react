import axios from 'axios';

let loadingCount = 0;

const setLoading = (loading) => {
  if (window.setGlobalLoading) {
    window.setGlobalLoading(loading);
  }
};

export default axios; 