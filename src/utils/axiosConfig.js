import axios from 'axios';
const baseURL = 'https://softline1.freshservice.com';
const axiosConfig = axios.create({
	baseURL: baseURL,
	timeout: 2000,
});

export default axiosConfig;
