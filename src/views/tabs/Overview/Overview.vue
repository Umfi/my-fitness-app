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
    <ion-content v-if="user" v-show="renderContent">
      <ion-refresher slot="fixed" @ionRefresh="doRefresh($event)">
        <ion-refresher-content> </ion-refresher-content>
      </ion-refresher>

      <!-- Calories Card-->
      <ion-card v-if="!loading && isCardVisible(1)" @click="showCardActionMenu(1, 'Calories Overview Card')">
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

     <!-- Water Consume Card -->
      <ion-card v-show="!loading && isCardVisible(2)" @click="showCardActionMenu(2, 'Water Consumption Card')">
        <ion-card-header>
          <ion-card-title>
            Water Consumption
          </ion-card-title>
        </ion-card-header>
        <ion-card-content>
         <apexchart
            width="100%"
            height="300"
            type="radialBar"
            :options="waterChartOptions"
            :series="waterSeries"
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

      <!-- BMI Card -->
      <ion-card v-bind:color="bmi_style" v-show="!loading && isCardVisible(3)" @click="showCardActionMenu(3, 'BMI Card')">
        <ion-card-header>
          <ion-card-title>
            BMI
          </ion-card-title>
        </ion-card-header>
        <ion-card-content>
            <ion-row>
              <ion-col>
                <ion-label v-text="bmi_value" style="font-size: 25px; font-weight: bold;"></ion-label>
              </ion-col>
              <ion-col class="ion-text-end ion-align-self-center">
                    <ion-icon v-if="bmi_icon == 'sad'" style="font-size: 25px; font-weight: bold;" :icon="sadOutline"></ion-icon>
                    <ion-icon v-if="bmi_icon == 'happy'" style="font-size: 25px; font-weight: bold;" :icon="happyOutline"></ion-icon>
              </ion-col>
              <ion-col class="ion-align-self-center">
                <ion-label v-text="bmi_text"></ion-label>
              </ion-col>
            </ion-row>
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
     
     
      <!-- Workout Card -->
      <ion-card v-show="!loading && isCardVisible(4)" @click="showCardActionMenu(4, 'Monthly Workout Summary Card')">
        <ion-card-header>
          <ion-card-title>
            Monthly Workout Summary
          </ion-card-title>
          <ion-card-subtitle>
            {{ workoutSeriesTitle }}
          </ion-card-subtitle>
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
      <ion-card v-show="!loading && isCardVisible(5)" @click="showCardActionMenu(5, 'Monthly Weight Summary Card')">
        <ion-card-header>
          <ion-card-title>
            Monthly Weight Summary
          </ion-card-title>
          <ion-card-subtitle>
            {{ weightSeriesTitle }}
          </ion-card-subtitle>
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
            <ion-icon :icon="scale"></ion-icon>
          </ion-fab-button>
          <ion-fab-button @click="trackWorkout">
             <ion-icon :icon="barbell"></ion-icon>
          </ion-fab-button>
          <ion-fab-button @click="trackWater">
            <ion-icon :icon="water"></ion-icon>
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
  IonCardSubtitle,
  IonSkeletonText,
  IonThumbnail,
  IonFab,
  IonFabList,
  IonFabButton,
  IonIcon,
  modalController,
  toastController,
  actionSheetController
} from "@ionic/vue";

import VueApexCharts from "vue3-apexcharts";

import { add, scale, barbell, water, sadOutline, happyOutline, eyeOff, close, arrowBack, arrowForward } from "ionicons/icons";

import { trackWaterConsumption, getUserData, updateUserSetting } from "@/service/UserService.js";

import { getDailyCalories, getWaterConsumption, getMonthlyWorkoutSummary, getWeightSummary } from "@/service/StatsService.js";
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
    IonCardSubtitle,
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
      add, scale, barbell, water, sadOutline, happyOutline, eyeOff, close, arrowForward, arrowBack
    };
  },
  data() {
    return {
      renderContent: false,
      settings: null,
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
      currentWorkoutDate: new Date(),
      workoutSeriesTitle: "Month Year",
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
      currentWeightDate: new Date(),
      weightSeriesTitle: "Month Year",
      weightSeries: [
        {
          name: "Weight",
          data: [1,1,1,1,1,1,1],
        },
      ],
      ///
      waterChartOptions: {
          chart: {
            type: 'radialBar',
            offsetY: -20,
            sparkline: {
              enabled: true
            }
          },
          plotOptions: {
            radialBar: {
              startAngle: -90,
              endAngle: 90,
              track: {
                background: "#e7e7e7",
                strokeWidth: '97%',
                margin: 5, // margin is in pixels
                dropShadow: {
                  enabled: true,
                  top: 2,
                  left: 0,
                  color: '#999',
                  opacity: 1,
                  blur: 2
                }
              },
              dataLabels: {
                name: {
                  show: false
                },
                value: {
                  offsetY: -2,
                  fontSize: '22px'
                }
              }
            }
          },
          grid: {
            padding: {
              top: -10
            }
          },
          fill: {
            type: 'gradient',
            gradient: {
              shade: 'light',
              shadeIntensity: 0.4,
              inverseColors: false,
              opacityFrom: 1,
              opacityTo: 1,
              stops: [0, 50, 53, 91]
            },
          },
      },
      waterSeries: [0],
      ////
      bmi_text: "",
      bmi_icon: "happy",
      bmi_value: 0,
      bmi_style: "success",
      loading: false,
      reloadAttempt: 0
    };
  },
  ionViewDidEnter() {
    this.renderContent = true;
  },
  ionViewWillLeave() {
    this.renderContent = false;
  },
  ionViewWillEnter() {
    this.doRefresh(false);
  },
  methods: 
  {
    async doRefresh(event) {
        this.loading = true;

        const userData = await getUserData();
        if (userData != null && userData.details != null) {
            this.settings = JSON.parse(userData.details.settings);
        }
        const loadCalories = await this.loadCaloriesSummary();
        const loadDailyWaterConsumption = await this.loadDailyWaterConsumption();

        const current = new Date();
        this.currentWorkoutDate = new Date();
        this.currentWeightDate = new Date();
        const loadMonthlyWorkout = await this.loadMonthlyWorkoutSummary(current.getMonth() + 1, current.getFullYear());
        const loadMonthlyWeight = await this.loadMonthlyWeightSummary(current.getMonth() + 1, current.getFullYear());
        const loadBMI = await this.calculateBMI();

        if ((this.reloadAttempt < 5) && (!loadCalories || !loadMonthlyWorkout || !loadMonthlyWeight || !loadDailyWaterConsumption || !loadBMI)) {
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
    async showToast(msg) {
      const toast = await toastController.create({
        message: msg,
        duration: 2000,
      });
      toast.present();
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
    async loadDailyWaterConsumption() {

      const data = await getWaterConsumption();
      
      if (data != null) {
        this.waterSeries = [data.waterConsumption];

        return true;
      }

      return false;
    },
    async loadMonthlyWorkoutSummary(month, year) {

      const data = await getMonthlyWorkoutSummary(month, year);

      if (data != null) {
        const current = new Date();
        current.setMonth(month-1);

        this.workoutSeriesTitle = current.toLocaleString('default', { month: 'long' }) + " " + year;
        this.series[0].data = data;
        return true;
      }

      return false;
    },
    async loadMonthlyWeightSummary(month, year) {

      const data = await getWeightSummary(month, year);

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

        const current = new Date();
        current.setMonth(month-1);

        this.weightSeriesTitle = current.toLocaleString('default', { month: 'long' }) + " " + year;
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
    async trackWater() {
 
      var tracked = await trackWaterConsumption({
        ml: 250, // one glass
      });

      if (tracked) {
        this.loadDailyWaterConsumption();
        this.showToast("Glass of water tracked.");
      } else {
        this.showToast("Couldn't track water consumption.");
      }

    },
    async calculateBMI() {
        
        const userData = await getUserData();

        if (userData != null) {
          var weight = userData.details.weight;
          var height = userData.details.height;
          var bmi = weight / (height * height) * 10000;
          bmi = bmi.toFixed(2);

          this.bmi_value = bmi;

          if (bmi < 18.5) {
            this.bmi_style = "warning";
            this.bmi_icon = "sad";
            this.bmi_text = "underweight";
          } else if (bmi >= 18.5 && bmi < 25) {
            this.bmi_style = "success";
            this.bmi_icon = "happy";
            this.bmi_text = "normal weight";
          } else if (bmi >= 25 && bmi < 30) {
            this.bmi_style = "warning";
            this.bmi_icon = "sad";
            this.bmi_text = "slight overweight";
          } else if (bmi >= 30 && bmi < 35) {
            this.bmi_style = "danger";
            this.bmi_icon = "sad";
            this.bmi_text = "overweight";
          } else if (bmi >= 35 && bmi < 40) {
            this.bmi_style = "danger";
            this.bmi_icon = "sad";
            this.bmi_text = "strong overweight";
          } else {
            this.bmi_style = "danger";
            this.bmi_icon = "sad";
            this.bmi_text = "very strong overweight";
          }

          return true;
        }
      return false;
    },
    async showCardActionMenu(cardID, cardTitle) {
     
      var actions = [
        {
          text: 'Hide',
          role: 'destructive',
          icon: eyeOff,
          handler: async () => {
              var data = { 
                "key": "showCard" + cardID, 
                "value": false 
            };
            const result = await updateUserSetting(data);
        
            if (!result) {
                this.showToast("Something went wrong. Could not hide card.")
            } else {
              this.doRefresh(false);
              this.showToast("You can show this card again. Just enable it in the settings.");
            }
          },
        },
        {
          text: 'Previous month data',
          icon: arrowBack,
          role: 'previous',
          handler: async () => {
            if (cardID == 4) {
              this.currentWorkoutDate.setMonth(this.currentWorkoutDate.getMonth()-1);
              this.loadMonthlyWorkoutSummary(this.currentWorkoutDate.getMonth()+1, this.currentWorkoutDate.getFullYear());
            } else if (cardID == 5) {
              this.currentWeightDate.setMonth(this.currentWeightDate.getMonth()-1);
              this.loadMonthlyWeightSummary(this.currentWeightDate.getMonth()+1, this.currentWeightDate.getFullYear());
            }
          },
        },
        {
          text: 'Next month data',
          icon: arrowForward,
          role: 'next',
          handler: async () => {
            if (cardID == 4) {
              this.currentWorkoutDate.setMonth(this.currentWorkoutDate.getMonth()+1);
              this.loadMonthlyWorkoutSummary(this.currentWorkoutDate.getMonth()+1, this.currentWorkoutDate.getFullYear());
            } else if (cardID == 5) {
              this.currentWeightDate.setMonth(this.currentWeightDate.getMonth()+1);
              this.loadMonthlyWeightSummary(this.currentWeightDate.getMonth()+1, this.currentWeightDate.getFullYear());
            }
          },
        },
        {
          text: 'Cancel',
          icon: close,
          role: 'cancel'
        },
      ];

      if (cardID < 4) {
          actions.splice(1, 2);
      }

      const actionSheet = await actionSheetController
        .create({
          header: cardTitle,
          buttons: actions
        });
      await actionSheet.present();
    },
    isCardVisible(cardID) {
      if (this.settings != null) {
          if ("showCard" + cardID in this.settings) {
              var returnVal = this.settings["showCard" + cardID];
              if (returnVal === true) {
                  return true;
              } else {
                  return false;
              }
          }
      }
      return true;
    }
  }
})
</script>
<style scoped>
.center-tex {
  display: flex;
  justify-content: center;
}
</style>