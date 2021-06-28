import axios from 'axios';
const apiClient = () => {
    const {REACT_APP_API_URL} = process.env;
    const axiosInst = axios.create({
        baseUrl:REACT_APP_API_URL,
        responseType:'json'
    })
    return axiosInst;
}
export default apiClient;