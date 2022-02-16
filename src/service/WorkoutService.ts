import $axios from "../helper/axios";
import $config from "@/config";
import { PersonalRecordModel } from "@/service/StatsService"

export interface WorkoutModel {
  id: number;
  user_id?: number;
  date: string;
  created_at?: string;
  updated_at?: string;
  shoulders: number;
  chest: number;
  back: number;
  arms: number;
  abs: number;
  legs: number;
  cardio: number;
  title: string;
  class: string;
  start: string;
  end: string;
}

interface StoreWorkoutModel {
    date: string;
    shoulders: number;
    chest: number;
    back: number;
    arms: number;
    abs: number;
    legs: number;
    cardio: number;
}

export interface AdvancedWorkoutModel {
  id: number;
  advanced_training_id: number;
  exercise_id: number;
  repetitions: number;
  weight: number;
  created_at: string;
  updated_at: string;
  name: string;
  exercise: ExerciseModel;
}

export interface ExerciseModel {
    id: number;
    name: string;
    created_at?: string;
    updated_at?: string;
}

interface StoreAdvancedWorkoutModel {
    date: string;
    exercises: ExerciseSetModel[];
}

interface StoreAdvancedWorkoutResultModel {
  advanceTraning: AdvanceTraningResultModel;
  new_personal_records: PersonalRecordModel[];
}

interface AdvanceTraningResultModel {
  date: string;
  user_id: number;
  updated_at: string;
  created_at: string;
  id: number;
  title: string;
  class: string;
  start: string;
  end: string;
}

export interface ExerciseSetModel {
  name: string;
  sets: SetModel[];
}

export interface SetModel {
    repetitions: number;
    weight: number;
}

export async function getAllWorkouts(startDate: string, endDate: string) {
    const data = await $axios({ url: $config.API_BASE_URL + 'trainings', data: { "from": startDate, "to": endDate}, method: 'POST' })
        .then(response => {
            if (response.data) { 
                return response.data.sort((a: WorkoutModel, b: WorkoutModel) => a.title.localeCompare(b.title)) as Array<WorkoutModel>;
            }

            return null;
        })
        .catch(err => {
            console.log(err);
            return null;
        })
        
        return data;
}

export async function getAllWorkoutsFromDay(date: string) {
    const data = await $axios({ url: $config.API_BASE_URL + 'trainingsFromDay', data: { "date": date }, method: 'POST' })
        .then(response => {
            console.log(response.data)
            if (response.data) { 
                return response.data.sort((a: WorkoutModel, b: WorkoutModel) => a.title.localeCompare(b.title)) as Array<WorkoutModel>;
            }

            return null;
        })
        .catch(err => {
            console.log(err);
            return null;
        })
        
        return data;
}

export async function storeWorkout(workout: StoreWorkoutModel) {
    const data = await $axios({ url: $config.API_BASE_URL + 'createTraining', data: workout, method: 'POST' })
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
                } as WorkoutModel;
            } 
            
            return null;
        })
        .catch(err => {
            console.log(err);
            return null;
        })

        return data;
}


export async function getAllExercises() {
    const data = await $axios({ url: $config.API_BASE_URL + 'exercises', method: 'GET' })
        .then(response => {
            if (response.data) { 
                return response.data.sort((a: ExerciseModel, b: ExerciseModel) => a.name.localeCompare(b.name)) as Array<ExerciseModel>;
            }

            return [] as Array<ExerciseModel>;
        })
        .catch(err => {
            console.log(err);
            return [] as Array<ExerciseModel>;
        })

        return data;
}

export async function getAllAdvancedWorkoutsFromDay(date: string) {
    const data = await $axios({ url: $config.API_BASE_URL + 'advancedTrainingsFromDay', data: { "date": date }, method: 'POST' })
        .then(response => {
            if (response.data) { 
                return response.data as Array<AdvancedWorkoutModel>;
            }

            return null;
        })
        .catch(err => {
            console.log(err);
            return null;
        })

        return data;
}


export async function storeAdvancedWorkout(workout: StoreAdvancedWorkoutModel) {
    const data = await $axios({ url: $config.API_BASE_URL + 'createAdvancedTraining', data: workout, method: 'POST' })
        .then(response => {
            if (response.data) {
                return response.data as StoreAdvancedWorkoutResultModel;
            } 
            
            return null;
        })
        .catch(err => {
            console.log(err);
            return null;
        })

        return data;
}