import axios, { AxiosInstance } from 'axios'
import router from '../router/index'
import { logout, refreshToken } from "../service/AuthService";
import { get } from "./storage";

const $axios : AxiosInstance = axios.create();

$axios.interceptors.request.use(
    async config => {

        const accessToken = await get("access_token");

        if (config.headers && accessToken) {
            config.headers['Authorization'] = `Bearer ${accessToken}`;
        }

        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);


let isRefreshing = false;
let failedQueue: Array<any> = [];

const processQueue = (error, token : string | null = null) => {
    failedQueue.forEach(prom => {
        if (error) {
            prom.reject(error);
        } else {
            prom.resolve(token);
        }
    });

    failedQueue = [];
};

$axios.interceptors.response.use(
    response => {
        return response;
    }, err => {
        const originalRequest = err.config;

        if (err.response.status === 401 && !originalRequest._retry) {

            if (originalRequest.url.includes("refresh") || originalRequest.url.includes("logout") || originalRequest.url.includes("login")) {
                logout(true).then(() => {
                     router.push('/login');
                 })
             } else {      
                if (isRefreshing) {
                    return new Promise(function(resolve, reject) {
                        failedQueue.push({ resolve, reject });
                    }).then(token => {
                        originalRequest.headers['Authorization'] = 'Bearer ' + token;
                        return axios(originalRequest);
                    }).catch(err => {
                        return Promise.reject(err);
                    });
                }

                originalRequest._retry = true;
                isRefreshing = true;

                return new Promise(function(resolve, reject) {

                    refreshToken().then(async (res) => {
                        if (res) {
                            // Perform previous request again
                            const accessToken = await get("access_token");
                            $axios.defaults.headers.common['Authorization'] = 'Bearer ' + accessToken;
                            originalRequest.headers['Authorization'] = 'Bearer ' + accessToken;
                            processQueue(null, accessToken);
                            resolve(axios(originalRequest));
                        } else {
                            processQueue(err, null);

                            logout().then(() => {
                                router.push('/login');
                            })
                            reject(err)
                        }

                        isRefreshing = false;
                    });
                });
            }
        }

        return Promise.reject(err);
    }
);

export default $axios;