import $axios from "../helper/axios.js";
import { config } from "../config.js"

export async function getAllWorkouts(startDate, endDate) {
    const data = await $axios({ url: config.API_BASE_URL + 'trainings', data: { "from": startDate, "to": endDate}, method: 'POST' })
        .then(response => {
            if (response.data) { 
                return response.data.sort((a, b) => a.title.localeCompare(b.title));
            }

            return null;
        })
        .catch(err => {
            console.log(err);
            return null;
        })

        return data;
}

export async function getAllWorkoutsFromDay(date) {
    const data = await $axios({ url: config.API_BASE_URL + 'trainingsFromDay', data: { "date": date }, method: 'POST' })
        .then(response => {
            if (response.data) { 
                return response.data.sort((a, b) => a.title.localeCompare(b.title));
            }

            return null;
        })
        .catch(err => {
            console.log(err);
            return null;
        })

        return data;
}

export async function storeWorkout(workout) {
    const data = await $axios({ url: config.API_BASE_URL + 'createTraining', data: workout, method: 'POST' })
        .then(response => {
            if (response.data) {
               
                return {
                    date: response.data.date,
                    start: response.data.start,
                    end: response.data.end,
                    id: response.data.id, 
                    title: response.data.title, 
                    class: response.data.class,
                    shoulders: response.data.shoulders,
                    chest: response.data.chest,
                    back: response.data.back,
                    arms: response.data.arms,
                    legs: response.data.legs,
                    abs: response.data.abs,
                    cardio: response.data.cardio
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
