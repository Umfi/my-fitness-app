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

$axios.interceptors.response.use(undefined, err => {
    const res = err.response;
    if (res.status === 401 && res.config && !res.config.__isRetryRequest) {
        return new Promise((resolve, reject) => {
            refreshToken().then(async (res) => {
                if (res) {
                    // Perform previous request again
                    const accessToken = await get("access_token");
                    err.config.__isRetryRequest = true;
                    err.config.headers.Authorization = 'Bearer ' + accessToken
                    resolve(axios(err.config))
                } else {
                    logout().then(() => {
                        router.push('/login');
                    })
                    reject(err)
                }
            });
        });
    }
})

export default $axios;