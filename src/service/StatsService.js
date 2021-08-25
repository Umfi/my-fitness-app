import $axios from "../helper/axios.js";
import { config } from "../config.js"

export async function getDailyCalories() {
    const data = await $axios(config.API_BASE_URL + 'dailyCalories')
        .then(response => {
            if (response.data) { 
                if (response.data.user != null) {
                    return {
                        user: response.data.user,
                        calories: response.data.calories,
                        protein: response.data.protein,
                        carbohydrate: response.data.carbohydrate,
                        fat: response.data.fat,
                        caloriesValue: parseInt(response.data.calories) / parseInt(response.data.user.calories),
                        proteinValue: parseInt(response.data.protein) / parseInt(response.data.user.protein),
                        carbohydrateValue: parseInt(response.data.carbohydrate) / parseInt(response.data.user.carbohydrate),
                        fatValue: parseInt(response.data.fat) / parseInt(response.data.user.fat)
                    };
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

export async function getWaterConsumption() {
    const data = await $axios(config.API_BASE_URL + 'dailyWaterConsumption')
        .then(response => {
            if (response.data) { 
                return response.data;
            }
            
            return null;
        })
        .catch(err => {
            console.log(err);
            return null;
        })

        return data;
}

export async function getMonthlyWorkoutSummary(month, year) {
    const data = await $axios(config.API_BASE_URL + 'monthlyWorkoutSummary?month=' + month + '&year=' + year)
        .then(response => {
            if (response.data) { 
                return response.data.asArray;
            }
            
            return null;
        })
        .catch(err => {
            console.log(err);
            return null;
        })

        return data;
}

export async function getWeightSummary(month, year) {
    const data = await $axios(config.API_BASE_URL + 'weightSummary?month=' + month + '&year=' + year)
        .then(response => {
            if (response.data) { 
                return response.data;
            }
            
            return null;
        })
        .catch(err => {
            console.log(err);
            return null;
        })

        return data;
}

export async function getPersonalRecords() {
    const data = await $axios(config.API_BASE_URL + 'getPersonalRecords')
        .then(response => {
            if (response.data.all) { 
                return response.data.all;
            }
            
            return null;
        })
        .catch(err => {
            console.log(err);
            return null;
        })

        return data;
}

export async function storePersonalRecords(records) {
    const data = await $axios({ url: config.API_BASE_URL + 'storePersonalRecords', data: records, method: 'POST' })
        .then(resp => {
            if (resp.data.result) {
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