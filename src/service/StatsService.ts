import $axios from "../helper/axios";
import $config from "@/config";

export interface DailyCaloriesModel {
  user: User;
  calories: number;
  protein: number;
  carbohydrate: number;
  fat: number;
  caloriesValue: number;
  proteinValue: number;
  carbohydrateValue: number;
  fatValue: number;
}

export interface User {
  id: number;
  name: string;
  email: string;
  email_verified_at?: any;
  created_at: string;
  updated_at: string;
  calories: number;
  carbohydrate: number;
  fat: number;
  protein: number;
  fcmtoken?: any;
}

interface WaterConsumptionModel {
  waterConsumption: number;
}

interface WeighTrackingModel {
  all: WeighTrackingData[];
  allCount: number;
  week: WeighTrackingData[];
  weekCount: number;
  month: WeighTrackingData[];
  monthCount: number;
  year: WeighTrackingData[];
  yearCount: number;
  fallback: number;
}

interface WeighTrackingData {
  id: number;
  user_id: number;
  date: string;
  weight: number;
  created_at: string;
  updated_at: string;
}

export interface PersonalRecordModel {
  id: number;
  user_id?: number;
  description: string;
  value: number;
  created_at?: string;
  updated_at?: string;
}

export async function getDailyCalories() {
    const data = await $axios($config.API_BASE_URL + 'dailyCalories')
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
                    } as DailyCaloriesModel;
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
    const data = await $axios($config.API_BASE_URL + 'dailyWaterConsumption')
        .then(response => {
            if (response.data) { 
                return response.data as WaterConsumptionModel;
            }
            
            return null;
        })
        .catch(err => {
            console.log(err);
            return null;
        })

        return data;
}

export async function getMonthlyWorkoutSummary(month: number, year: number) {
    const data = await $axios($config.API_BASE_URL + 'monthlyWorkoutSummary?month=' + month + '&year=' + year)
        .then(response => {
            if (response.data) { 
                return response.data.asArray as Array<number>;
            }
            
            return null;
        })
        .catch(err => {
            console.log(err);
            return null;
        })

        return data;
}

export async function getWeightSummary(month: number, year: number) {
    const data = await $axios($config.API_BASE_URL + 'weightSummary?month=' + month + '&year=' + year)
        .then(response => {
            if (response.data) { 
                return response.data as WeighTrackingModel;
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
    const data = await $axios($config.API_BASE_URL + 'getPersonalRecords')
        .then(response => {
            if (response.data.all) { 
                return response.data.all as Array<PersonalRecordModel>;
            }
            
            return null;
        })
        .catch(err => {
            console.log(err);
            return null;
        })

        return data;
}

export async function storePersonalRecords(recordsData: Array<PersonalRecordModel>) {
    const data = await $axios({ url: $config.API_BASE_URL + 'storePersonalRecords', data: {
        records: recordsData,
      }, method: 'POST' })
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