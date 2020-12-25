import { get, set, remove } from "./storage.js";
import $axios from "../axios.js";
import { config } from "../config.js"


export async function isLoggedIn() {
    const access_token = await get("access_token")
    if (access_token) {
        return true;
    } else {
        return false;
    }
}

export async function isSetup() {
    const set_up = await get("is_setup")
    if (set_up == 'true') {
        return true;
    } else {
        return false;
    }
}

export async function login(user) {
    const data = await $axios({ url: config.API_BASE_URL + 'login', data: user, method: 'POST' })
        .then(resp => {

            const access_token = resp.data.access_token
            const is_setup = resp.data.user.calories > 0 ? 'true' : 'false';

            set("is_setup", is_setup)
            set("access_token", access_token)

            return true;
        })
        .catch(err => {
            console.log(err);
            remove("access_token")
            remove("is_setup")
            return false;
        })

        return data;
}

export async function register(user) {
    const data = await $axios({url: config.API_BASE_URL + 'register', data: user, method: 'POST' })
    .then(() => {
        return true;
    })
    .catch(err => {
      console.log(err);
      return false;
    })

    return data;
}

export async function logout(forceLogout = false) {
    if (!forceLogout) {
        await $axios({url: config.API_BASE_URL + 'logout', method: 'POST' }).then(() => {
            remove("access_token")
            remove("is_setup")
            delete $axios.defaults.headers.common['Authorization']
        })
    } else {
        remove("access_token")
        remove("is_setup")
        delete $axios.defaults.headers.common['Authorization']
    }
}

export async function refreshToken() {
    const data = await $axios({url: config.API_BASE_URL + 'refresh', method: 'POST' })
    .then(resp => {
      const access_token = resp.data.access_token
      set("access_token", access_token)

      return true;
    })
    .catch((err) => {
      console.log(err);
      return false;
    })

    return data;
}


export async function setup(detail) {
    const data = await $axios({ url: config.API_BASE_URL + 'user', data: detail, method: 'POST' })
        .then(resp => {
            if (resp.data.user.calories > 0) {
                const is_setup = 'true';
                set("is_setup", is_setup)
                return true;
            } else {
                return false;
            }
        })
        .catch(err => {
            console.log(err);
            return false;
        })

        return data;
}