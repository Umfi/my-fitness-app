import $axios from "../helper/axios.js";
import { config } from "../config.js"

export async function searchProduct(searchTerm, page) {
    const data = await $axios(config.API_BASE_URL + "foodsearch?name=" + searchTerm + "&page=" + page)
        .then(resp => {
            if (resp.data) {
                return resp.data;
            }

            return null;
        })
        .catch(err => {
            console.log(err);
            return null;
        })

        return data;
}

export async function createProduct(product) {
    const data = await $axios({ url: config.API_BASE_URL + 'createProduct', data: product, method: 'POST' })
        .then(response => {
            if (response.data.status) {
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

export async function updateProduct(product) {
    const data = await $axios({ url: config.API_BASE_URL + 'editProduct', data: product, method: 'POST' })
        .then(response => {
            if (response.data.status) {
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

export async function removeProduct(product) {
    const data = await $axios({ url: config.API_BASE_URL + 'deleteProduct', data: product, method: 'POST' })
        .then(response => {
            if (response.data.status) {
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

export async function trackCalories(product) {
    const data = await $axios({ url: config.API_BASE_URL + 'track', data: product, method: 'POST' })
        .then(response => {
            if (response.data.status) {
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
