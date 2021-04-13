import $axios from "../helper/axios.js";
import { config } from "../config.js"

export async function getAllWorkouts() {
    const data = await $axios(config.API_BASE_URL + 'trainings')
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

export async function updateWorkout(workout) {
    const data = await $axios({ url: config.API_BASE_URL + 'editTraining', data: workout, method: 'POST' })
        .then(response => {
            if (response.data) {
                return response.data[0];
            } 
            
            return null;
        })
        .catch(err => {
            console.log(err);
            return null;
        })

        return data;
}

export async function removeWorkout(deleteID) {
    const data = await $axios({ url: config.API_BASE_URL + 'deleteTraining/' + deleteID, method: 'POST' })
        .then(response => {
            if (response.data) {
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
