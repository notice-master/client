import axios from 'axios';
const restApi = axios.create({
  timeout: 3000,
  headers: {},
});
restApi.interceptors.request.use(
  (config) => {
    return config;
  },
  (e) => {
    console.log('request error: ', e);
  }
);
restApi.interceptors.response.use(
  (response) => {
    return response;
  },
  (e) => {
    console.log('response error: ', e);
  }
);

export default restApi;
