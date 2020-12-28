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

      <!-- Calories Card-->
      <ion-card v-if="!loading">
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

      <ion-card v-if="loading">
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
                    <ion-col text-center>
                      <ion-label class="center-tex">
                        <ion-skeleton-text animated style="width: 40%"></ion-skeleton-text>
                      </ion-label>
                    </ion-col>
                  </ion-row>
                  <ion-row>
                    <ion-skeleton-text animated style="width: 100%"></ion-skeleton-text>
                  </ion-row>
                  <ion-row>
                    <ion-col text-center>
                      <ion-label class="center-tex">
                        <ion-skeleton-text animated style="width: 20%"></ion-skeleton-text>
                      </ion-label>
                    </ion-col>
                  </ion-row>
                </ion-grid>
              </ion-item>
            </ion-list>
        </ion-card-content>
      </ion-card>

      <!-- Workout Card -->
      <ion-card v-show="!loading">
        <ion-card-header>
          <ion-card-title>
            Monthly Workout Summary
          </ion-card-title>
        </ion-card-header>
        <ion-card-content>
         <apexchart
            width="100%"
            height="300"
            type="bar"
            :options="chartOptions"
            :series="series"
          ></apexchart>
        </ion-card-content>
      </ion-card>

      <ion-card v-if="loading">
        <ion-card-header>
          <ion-card-title>
            <ion-skeleton-text animated style="width: 60%"></ion-skeleton-text>
          </ion-card-title>
        </ion-card-header>
        <ion-card-content>
          <ion-thumbnail style="width: 100%;">
          <ion-skeleton-text animated></ion-skeleton-text>
          </ion-thumbnail>
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
  IonSkeletonText,
  IonThumbnail
} from "@ionic/vue";

import VueApexCharts from "vue3-apexcharts";

import { config } from "@/config.js"
import $axios from "@/axios.js"

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
    IonSkeletonText,
    IonThumbnail,
    apexchart: VueApexCharts
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
      fatValue: 0,
      ////
      chartOptions: {
        chart: {
          id: 'vuechart-example',
          toolbar: {
            show: false
          },
        },
        dataLabels: {
            enabled: true
        },
        tooltip: {
          enabled: false,
        },
        legend: {
          show: false
        },
        colors:['#84A07C', '#01BAEF', '#20BF55', '#1B998B', '#FF674D', '#CF1259', '#7776BC'],
        plotOptions: {
          bar: {
            distributed: true
          }
        },
        xaxis: {
          categories: ["Shoulders", "Chest", "Back", "Legs", "Arms", "Abs", "Cardio"],
           labels: {
            show: true
          }
        },
      
      },
      series: [
        {
          name: "Workouts",
          data: [1,1,1,1,1,1,1],
        },
      ],
      ///
      loading: false
    };
  },
  ionViewWillEnter() {
    this.doRefresh(false);
  },
  methods: {
  async doRefresh(event) {
      this.loading = true;

      const loadCalories = await this.loadCaloriesSummary();
      const loadMonthlyWorkout = await this.loadMonthlyWorkoutSummary();
      
      if (!loadCalories || !loadMonthlyWorkout) {
        setTimeout(() => {
          this.doRefresh(event);
        }, 1000);
      } else {
        window.dispatchEvent(new Event('resize'));
        this.loading = false;
        if (event) 
          event.target.complete();
      }
  },
  async loadCaloriesSummary() {

    const data = await $axios(config.API_BASE_URL + 'dailyCalories')
    .then(response => {

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

            }
        }

        return true;
    })
    .catch(err => {
        console.log(err);
        return false;
    })

    return data;
  },
  async loadMonthlyWorkoutSummary() {

    var that = this;

    const data = await $axios(config.API_BASE_URL + 'monthlyWorkoutSummary')
    .then(response => {

      if (response.data) {
       that.series[0].data = response.data.asArray;
      }

      return true;
    })
    .catch(err => {
        console.log(err);
        return false;
    })

    return data;
  },
  }
})
</script>
<style scoped>
.center-tex {
  display: flex;
  justify-content: center;
}
</style>