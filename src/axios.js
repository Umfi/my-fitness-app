import axios from 'axios'
import { store }from './store/store.js'

const $axios = axios.create();

$axios.interceptors.request.use(
    (config) => {
        const access_token = localStorage.getItem('access_token')
        if (access_token) {
            config.headers['Authorization'] = `Bearer ${access_token}`;
        }
        return config;
    },

    (error) => {
        return Promise.reject(error);
    }
);


$axios.interceptors.response.use((response) => {
    return response;
}, function (error) {
    if (error.response.status === 401) {
        if (error.config.url.includes("refresh")) {
            store.dispatch("forcelogout");
        } else {
            store.dispatch("refreshToken").then(() => {
                // Perform previous request again
                return $axios({
                    method: error.config.method,
                    url: error.config.url,
                    data: error.config.data
                });
            });
        }
    }
    return Promise.reject(error.response);
});



export default $axios;