<template>
        <ion-card v-if="!loadingCard" ref="card">
        <ion-card-header>
            <ion-card-title>
            Calories Overview
            </ion-card-title>
        </ion-card-header>
        <ion-card-content>
            <ion-list>
                <ion-item>
                <ion-grid>
                    <ion-row>
                    <ion-col class="ion-text-center">
                        <ion-label >
                        <b>Calories</b>
                        </ion-label>
                    </ion-col>
                    </ion-row>
                    <ion-row>
                    <ion-progress-bar :value="caloriesValue"></ion-progress-bar>
                    </ion-row>
                    <ion-row>
                    <ion-col class="ion-text-center">
                        <ion-label >
                        {{ parseInt(calories) }} kcal / {{ parseInt(user.calories) }} kcal</ion-label >
                    </ion-col>
                    </ion-row>
                </ion-grid>
                </ion-item>
                <ion-item>
                <ion-grid>
                    <ion-row>
                    <ion-col class="ion-text-center">
                        <ion-label >
                        <b>Protein</b>
                        </ion-label>
                    </ion-col>
                    </ion-row>
                    <ion-row>
                    <ion-progress-bar color="success" :value="proteinValue"></ion-progress-bar>
                    </ion-row>
                    <ion-row>
                    <ion-col class="ion-text-center">
                        <ion-label >
                        {{ parseInt(protein) }} g / {{ parseInt(user.protein) }} g</ion-label >
                    </ion-col>
                    </ion-row>
                </ion-grid>
                </ion-item>
                <ion-item>
                <ion-grid>
                    <ion-row>
                    <ion-col class="ion-text-center">
                        <ion-label >
                        <b>Carbohydrate</b>
                        </ion-label>
                    </ion-col>
                    </ion-row>
                    <ion-row>
                    <ion-progress-bar color="warning" :value="carbohydrateValue"></ion-progress-bar>
                    </ion-row>
                    <ion-row>
                    <ion-col class="ion-text-center">
                        <ion-label >
                        {{ parseInt(carbohydrate) }} g / {{ parseInt(user.carbohydrate) }} g</ion-label >
                    </ion-col>
                    </ion-row>
                </ion-grid>
                </ion-item>
                <ion-item>
                <ion-grid>
                    <ion-row>
                    <ion-col class="ion-text-center">
                        <ion-label >
                        <b>Fat</b>
                        </ion-label>
                    </ion-col>
                    </ion-row>
                    <ion-row>
                    <ion-progress-bar color="danger" :value="fatValue"></ion-progress-bar>
                    </ion-row>
                    <ion-row>
                    <ion-col class="ion-text-center">
                        <ion-label >
                        {{ parseInt(fat) }} g / {{ parseInt(user.fat) }} g</ion-label >
                    </ion-col>
                    </ion-row>
                </ion-grid>
                </ion-item>
            </ion-list>
        </ion-card-content>
        </ion-card>

        <ion-card v-if="loadingCard">
            <ion-card-header>
                <ion-card-title>
                <ion-skeleton-text animated style="width: 60%"></ion-skeleton-text>
                </ion-card-title>
            </ion-card-header>
            <ion-card-content>
                <ion-list>
                    <ion-item v-for="n in 4" v-bind:key="n">
                    <ion-grid>
                        <ion-row>
                        <ion-col>
                            <ion-label >
                            <ion-skeleton-text animated style="width: 40%"></ion-skeleton-text>
                            </ion-label>
                        </ion-col>
                        </ion-row>
                        <ion-row>
                        <ion-skeleton-text animated style="width: 100%"></ion-skeleton-text>
                        </ion-row>
                        <ion-row>
                        <ion-col >
                            <ion-label >
                            <ion-skeleton-text animated style="width: 20%"></ion-skeleton-text>
                            </ion-label>
                        </ion-col>
                        </ion-row>
                    </ion-grid>
                    </ion-item>
                </ion-list>
            </ion-card-content>
        </ion-card>
</template>

<script lang="ts">
import { defineComponent, onMounted, ref } from "vue";
import {
  IonItem,
  IonLabel,
  IonList,
  IonGrid,
  IonCol,
  IonRow,
  IonCard,
  IonCardHeader,
  IonCardContent,
  IonCardTitle,
  IonSkeletonText,
  IonProgressBar
} from "@ionic/vue";

import { createGesture } from '@ionic/vue';

import { User, getDailyCalories } from "@/service/StatsService";

export default defineComponent({
  name: "CaloriesCard",
  emits: ["pushed"],
  components: {
    IonItem,
    IonList,
    IonLabel,
    IonGrid,
    IonCol,
    IonRow,
    IonCard,
    IonCardHeader,
    IonCardContent,
    IonCardTitle,
    IonSkeletonText,
    IonProgressBar
  },
  setup(_, context) {
    const card = ref();

    let user = ref<User>();
    let calories = ref(0);
    let protein = ref(0);
    let carbohydrate = ref(0);
    let fat = ref(0);
    let caloriesValue = ref(0);
    let proteinValue = ref(0);
    let carbohydrateValue = ref(0);
    let fatValue = ref(0);
    let loadingCard = ref(true);

    async function loadCaloriesSummary() {

      const data = await getDailyCalories();
      
      if (data !== null) {
        user.value = data.user;
        calories.value = data.calories;
        protein.value = data.protein;
        carbohydrate.value = data.carbohydrate;
        fat.value = data.fat;
        caloriesValue.value = data.caloriesValue;
        proteinValue.value = data.proteinValue;
        carbohydrateValue.value = data.carbohydrateValue;
        fatValue.value = data.fatValue;
        loadingCard.value = false;
        return true;
      }

      return false;
    }

    function reload() {
      loadingCard.value = true;
      loadCaloriesSummary();
    }


    let longPressActive = false;
    let timer: number | undefined;
    function gestureStart() {
      longPressActive = true;
      timer = setTimeout(function () {
          if (longPressActive === true) {
             context.emit("pushed");
             longPressActive = false;
          }
      }, 600);
    }
    function gestureMove() {
      longPressActive = false;
    }
    function gestureEnd() {
      longPressActive = false;
      if (timer) {
        clearInterval(timer);
        timer = undefined;
      }
    }

    
    onMounted(async () => {
      await loadCaloriesSummary();

      const gesture = createGesture({
        gestureName: 'card-longpress',
        el: card.value.$el,
        threshold: 0,
          onStart: () => { gestureStart() },
          onMove: () => { gestureMove() },
          onEnd: () => { gestureEnd() }
      });
      gesture.enable(true);
     });

     return {
         card, user, calories, protein, carbohydrate, fat, caloriesValue, proteinValue, carbohydrateValue, fatValue, loadingCard, reload
     }
  }
})
</script>