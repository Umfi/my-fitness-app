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


      <!-- Weight Card -->
      <ion-card v-show="!loading">
        <ion-card-header>
          <ion-card-title>
            Monthly Weight Summary
          </ion-card-title>
        </ion-card-header>
        <ion-card-content>
         <apexchart
            width="100%"
            height="300"
            type="line"
            :options="weightChartOptions"
            :series="weightSeries"
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
     

      <ion-fab vertical="bottom" horizontal="end" slot="fixed">
        <ion-fab-button>
          <ion-icon :icon="add"></ion-icon>
        </ion-fab-button>
        <ion-fab-list side="top">
          <ion-fab-button @click="trackWeight">
            <ion-icon :icon="man"></ion-icon>
           </ion-fab-button>
           <ion-fab-button @click="trackWorkout">
             <ion-icon :icon="barbell"></ion-icon>
             </ion-fab-button>
        </ion-fab-list>
      </ion-fab>


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
  IonThumbnail,
  IonFab,
  IonFabList,
  IonFabButton,
  IonIcon,
  modalController,
} from "@ionic/vue";

import VueApexCharts from "vue3-apexcharts";

import { add, man, barbell } from "ionicons/icons";


import { getDailyCalories, getMonthlyWorkoutSummary, getWeightSummary } from "@/service/StatsService.js";
import ModalTrackWeight from "./ModalTrackWeight.vue";
import ModalManageWorkout from "../Workouts/ModalManageWorkout.vue";

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
    IonFab,
    IonFabList,
    IonFabButton,
    IonIcon,
    apexchart: VueApexCharts
  },
  setup() {
    return {
      add, man, barbell
    };
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
      weightChartOptions: {
        chart: {
          id: 'vuechart-weight',
          toolbar: {
            show: false
          },
        },
        dataLabels: {
            enabled: false
        },
        tooltip: {
          enabled: false,
        },
        legend: {
          show: false
        },
        xaxis: {
          labels: {
            show: false
          }
        },
      
      },
      weightSeries: [
        {
          name: "Weight",
          data: [1,1,1,1,1,1,1],
        },
      ],
      ///
      loading: false,
      reloadAttempt: 0
    };
  },
  ionViewWillEnter() {
    this.doRefresh(false);
  },
  methods: 
  {
    async doRefresh(event) {
        this.loading = true;

        const loadCalories = await this.loadCaloriesSummary();
        const loadMonthlyWorkout = await this.loadMonthlyWorkoutSummary();
        const loadMonthlyWeight = await this.loadMonthlyWeightSummary();

        if ((this.reloadAttempt < 5) && (!loadCalories || !loadMonthlyWorkout || !loadMonthlyWeight)) {
          this.reloadAttempt++;
          setTimeout(() => {
            this.doRefresh(event);
          }, 1000);
        } else {
          this.reloadAttempt = 0;
          window.dispatchEvent(new Event('resize'));
          this.loading = false;
          if (event) 
            event.target.complete();
        }
    },
    async loadCaloriesSummary() {

      const data = await getDailyCalories();
      
      if (data != null) {
        this.user = data.user;
        this.calories = data.calories;
        this.protein = data.protein;
        this.carbohydrate = data.carbohydrate;
        this.fat = data.fat;
        this.caloriesValue = data.caloriesValue;
        this.proteinValue = data.proteinValue;
        this.carbohydrateValue = data.carbohydrateValue;
        this.fatValue = data.fatValue;

        return true;
      }

      return false;
    },
    async loadMonthlyWorkoutSummary() {

      const data = await getMonthlyWorkoutSummary();

      if (data != null) {
        this.series[0].data = data;
        return true;
      }

      return false;
    },
    async loadMonthlyWeightSummary() {

      const data = await getWeightSummary();

      if (data != null) {

        var arr = [];
        if (data.month.length > 0) {
          for (var i = 0; i < data.month.length; i++) {
            arr.push(data.month[i].weight);
          }
        } else {
          if (data.fallback > 0) {
            arr.push(data.fallback);
          }
        }
        
        this.weightSeries[0].data = arr;
        return true;
      }

      return false;
    },
    async trackWeight() {

      const modal = await modalController
        .create({
          component: ModalTrackWeight,
           componentProps: {
            parent: this
          },
        })
      return modal.present();
    },
    async trackWorkout() {

      var today = new Date();
      
      const modal = await modalController
        .create({
          component: ModalManageWorkout,
           componentProps: {
            item: {
              date: today.format(),
            },
            title: "Track workout",
            mode: "create",
            parent: this,
          },
        })
      return modal.present();
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