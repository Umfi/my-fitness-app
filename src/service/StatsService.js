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

export async function getMonthlyWorkoutSummary() {
    const data = await $axios(config.API_BASE_URL + 'monthlyWorkoutSummary')
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


