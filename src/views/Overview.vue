<template>
  <ion-page>
    <ion-header :translucent="true">
      <ion-toolbar>
        <ion-buttons slot="start">
          <ion-menu-button></ion-menu-button>
        </ion-buttons>
        <ion-title>My Fitness App</ion-title>
      </ion-toolbar>
    </ion-header>
    <ion-content v-if="user">
      <ion-refresher slot="fixed" @ionRefresh="doRefresh($event)">
        <ion-refresher-content> </ion-refresher-content>
      </ion-refresher>

<ion-card>
  <ion-card-header>
    <ion-card-title>
      Hey, {{ user.name }}!
    </ion-card-title>
  </ion-card-header>
  <ion-card-content>

     <ion-list>
        <ion-item>
          <ion-grid>
            <ion-row>
              <ion-col text-center>
                <ion-label class="center-tex">
                  <b>Calories</b>
                </ion-label>
              </ion-col>
            </ion-row>
            <ion-row>
              <ion-progress-bar :value="caloriesValue"></ion-progress-bar>
            </ion-row>
            <ion-row>
              <ion-col text-center>
                <ion-label class="center-tex">
                  {{ parseInt(calories) }} kcal / {{ parseInt(user.calories) }} kcal</ion-label >
              </ion-col>
            </ion-row>
          </ion-grid>
        </ion-item>

        <ion-item>
          <ion-grid>
            <ion-row>
              <ion-col text-center>
                <ion-label class="center-tex">
                  <b>Protein</b>
                </ion-label>
              </ion-col>
            </ion-row>
            <ion-row>
              <ion-progress-bar color="success" :value="proteinValue"></ion-progress-bar>
            </ion-row>
            <ion-row>
              <ion-col text-center>
                <ion-label class="center-tex">
                  {{ parseInt(protein) }} g / {{ parseInt(user.protein) }} g</ion-label >
              </ion-col>
            </ion-row>
          </ion-grid>
        </ion-item>

        <ion-item>
          <ion-grid>
            <ion-row>
              <ion-col text-center>
                <ion-label class="center-tex">
                  <b>Carbohydrate</b>
                </ion-label>
              </ion-col>
            </ion-row>
            <ion-row>
              <ion-progress-bar color="warning" :value="carbohydrateValue"></ion-progress-bar>
            </ion-row>
            <ion-row>
              <ion-col text-center>
                <ion-label class="center-tex">
                  {{ parseInt(carbohydrate) }} g / {{ parseInt(user.carbohydrate) }} g</ion-label >
              </ion-col>
            </ion-row>
          </ion-grid>
        </ion-item>

        <ion-item>
          <ion-grid>
            <ion-row>
              <ion-col text-center>
                <ion-label class="center-tex">
                  <b>Fat</b>
                </ion-label>
              </ion-col>
            </ion-row>
            <ion-row>
              <ion-progress-bar color="danger" :value="fatValue"></ion-progress-bar>
            </ion-row>
            <ion-row>
              <ion-col text-center>
                <ion-label class="center-tex">
                  {{ parseInt(fat) }} g / {{ parseInt(user.fat) }} g</ion-label >
              </ion-col>
            </ion-row>
          </ion-grid>
        </ion-item>

      </ion-list>


  </ion-card-content>
</ion-card>

     
    </ion-content>
  </ion-page>
</template>

<script>
import { defineComponent } from "vue";
import {
  IonContent,
  IonHeader,
  IonPage,
  IonTitle,
  IonToolbar,
  IonButtons,
  IonMenuButton,
  IonRefresher,
  IonRefresherContent,
  IonItem,
  IonLabel,
  IonList,
  IonProgressBar,
  IonGrid,
  IonCol,
  IonRow,
  IonCard,
  IonCardHeader,
  IonCardContent,
  IonCardTitle,
} from "@ionic/vue";

import { config } from "../config.js"

export default defineComponent({
  name: "Overview",
  components: {
    IonContent,
    IonHeader,
    IonPage,
    IonTitle,
    IonToolbar,
    IonButtons,
    IonMenuButton,
    IonRefresher,
    IonRefresherContent,
    IonItem,
    IonList,
    IonLabel,
    IonProgressBar,
    IonGrid,
    IonCol,
    IonRow,
    IonCard,
    IonCardHeader,
    IonCardContent,
    IonCardTitle,
  },
  data() {
    return {
      user: null,
      calories: 0,
      protein: 0,
      carbohydrate: 0,
      fat: 0,
      caloriesValue: 0,
      proteinValue: 0,
      carbohydrateValue: 0,
      fatValue: 0
    };
  },
  created() {
    this.doRefresh(false);
  },
  ionViewWillEnter() {
    this.doRefresh(false);
  },
  methods: {
    doRefresh(event) {
      this.$http
        .post(config.API_BASE_URL + "dailyCalories")
        .then((response) => {
          if (response.data) {

            if (response.data.user != null) {
              this.user = response.data.user;
              this.calories = response.data.calories;
              this.protein = response.data.protein;
              this.carbohydrate = response.data.carbohydrate;
              this.fat = response.data.fat;

              this.caloriesValue = parseInt(this.calories) / parseInt(this.user.calories);
              this.proteinValue = parseInt(this.protein) / parseInt(this.user.protein);
              this.carbohydrateValue = parseInt(this.carbohydrate) / parseInt(this.user.carbohydrate);
              this.fatValue = parseInt(this.fat) / parseInt(this.user.fat);

              if (event) event.target.complete();
            }
          }
        });
    },
  },
});
</script>
<style scoped>
.center-tex {
  display: flex;
  justify-content: center;
}
</style>