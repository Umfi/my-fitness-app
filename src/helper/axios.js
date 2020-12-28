import axios from 'axios'
import router from '../router/index.js'
import { logout, refreshToken } from "../service/AuthService.js";
import { get } from "./storage.js";

const $axios = axios.create();

$axios.interceptors.request.use(
    async config => {

        const access_token = await get("access_token");

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
        if (error.config.url.includes("refresh") || error.config.url.includes("logout") || error.config.url.includes("login")) {
            logout(true).then(() => {
                router.push('/login');
            })
        } else {
            refreshToken().then((res) => {

                if (res) {
                    // Perform previous request again
                    return $axios({
                        method: error.config.method,
                        url: error.config.url,
                        data: error.config.data
                    });
                } else {
                    logout().then(() => {
                        router.push('/login');
                    })
                }
            });
        }
    }
    return Promise.reject(error.response);
});



export default $axios;