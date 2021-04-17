import { get, set } from "../helper/storage.js";
import $axios from "../helper/axios.js";
import { config } from "../config.js"

export async function isSetup() {
    const set_up = await get("is_setup")
    if (set_up == 'true') {
        return true;
    } else {
        return false;
    }
}

export async function updateUserData(detail) {
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

export async function getUserData() {
    const data = await $axios(config.API_BASE_URL + 'user')
        .then(resp => {
            if (resp.data[0]) {
                if (resp.data[0].calories != null) {
                  return resp.data[0];
                }
            }

            return null;
        })
        .catch(err => {
            console.log(err);
            return null;
        })

        return data;
}

export async function updateUserSetting(setting) {
    const data = await $axios({ url: config.API_BASE_URL + 'updateSettings', data: setting, method: 'POST' })
        .then(resp => {
            if (resp.data.status) {
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

export async function trackWeight(weight) {
    const data = await $axios({ url: config.API_BASE_URL + 'trackWeight', data: weight, method: 'POST' })
        .then(response => {
            if (response.data.weight) {
                return true;
            } 
            
            return false;
        })
        .catch(err => {
            console.log(err);
            return false;
        })

        return data;
}

export async function trackWaterConsumption(ml) {
    const data = await $axios({ url: config.API_BASE_URL + 'trackWaterConsumption', data: ml, method: 'POST' })
        .then(response => {
            if (response.data.waterConsumption) {
                return true;
            } 
            
            return false;
        })
        .catch(err => {
            console.log(err);
            return false;
        })

        return data;
}
