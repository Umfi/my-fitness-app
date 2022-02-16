import $axios from "../helper/axios";
import $config from "@/config";

interface FoodSearchResultModel {
  searchResult: SearchResultModel[];
  searchHistory: SearchHistoryModel[];
  todayResults: TodayResultModel[];
  maxResults: number;
}

export interface TodayResultModel {
  id: number;
  user_id: number;
  date: string;
  calories: number;
  carbohydrate: number;
  fat: number;
  protein: number;
  created_at: string;
  updated_at: string;
  name: string;
  brand: string;
}

export interface SearchHistoryModel {
  id: number;
  user_id: number;
  name: string;
  brand: string;
  calories: number;
  carbohydrate: number;
  fat: number;
  protein: number;
  created_at: string;
  updated_at: string;
  cnt: number;
  cached: boolean;
  editable: boolean;
  deletable: boolean;
  scanned: boolean;
  historyItem: boolean;
  show: boolean;
}

export interface SearchResultModel {
  id: number;
  user_id?: number;
  name: string;
  brand: string;
  calories: number;
  carbohydrate: number;
  fat: number;
  protein: number;
  created_at?: string;
  updated_at?: string;
  cnt?: number;
  cached: boolean;
  editable: boolean;
  deletable: boolean;
  scanned: boolean;
  historyItem: boolean;
  show: boolean;
}

interface ProductModel {
    id?: number;
    name: string;
    calories: number;
    carbohydrate: number;
    fat: number;
    protein: number;
}

interface TrackCaloriesModel {
    name: string;
    brand: string;
    calories: number;
    carbohydrate: number;
    fat: number;
    protein: number;
    gramm: number;
}

export async function searchProduct(searchTerm: string, page: number) {
    const data = await $axios($config.API_BASE_URL + "foodsearch?name=" + searchTerm + "&page=" + page)
        .then(resp => {
            if (resp.data) {
                return resp.data as FoodSearchResultModel;
            }

            return null;
        })
        .catch(err => {
            console.log(err);
            return null;
        })

        return data;
}


export async function searchProductByBarcode(barcode: string) {
    const data = await $axios($config.API_BASE_URL + "barcode?barcode=" + barcode)
        .then(resp => {
            if (resp.data.product && resp.data.product != "") {
                return resp.data.product as SearchResultModel;
            }

            return null;
        })
        .catch(err => {
            console.log(err);
            return null;
        })

        return data;
}


export async function createProduct(product: ProductModel) {
    const data = await $axios({ url: $config.API_BASE_URL + 'createProduct', data: product, method: 'POST' })
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

export async function updateProduct(product: ProductModel) {
    const data = await $axios({ url: $config.API_BASE_URL + 'editProduct', data: product, method: 'POST' })
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

export async function removeProduct(productName: string, productId: number) {
    const data = await $axios({ url: $config.API_BASE_URL + 'deleteProduct', data: {
        name: productName,
        id: productId
    }, method: 'POST' })
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

export async function trackCalories(product: TrackCaloriesModel) {
    const data = await $axios({ url: $config.API_BASE_URL + 'track', data: product, method: 'POST' })
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

export async function untrackCalories(productId: number) {
    const data = await $axios({ url: $config.API_BASE_URL + 'untrack', data: { id: productId }, method: 'POST' })
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