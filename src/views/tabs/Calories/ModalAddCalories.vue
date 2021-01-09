<template>
  <ion-header translucent>
    <ion-toolbar>
      <ion-title>How much grams?</ion-title>
      <ion-buttons slot="end">
        <ion-button @click="dismissModal">
          <ion-icon slot="icon-only" :icon="close"></ion-icon>
        </ion-button>
      </ion-buttons>
    </ion-toolbar>
  </ion-header>
  <ion-content fullscreen>
    <ion-row>
      <ion-col>
      <apexchart
            width="100%"
            height="300"
            type="radialBar"
            :options="chartOptions"
            :series="series"
          ></apexchart>
      </ion-col>
    </ion-row>

    <ion-list>
      <ion-item>
        <ion-grid>
          <ion-row>
            <ion-col size="2">
              <ion-button expand="block" color="medium" fill="outline" @click="adjustAmount('-')">
                <ion-icon slot="icon-only" :icon="remove"></ion-icon>
              </ion-button>
            </ion-col>
            <ion-col size="8">
              <ion-input
                type="number"
                v-model="amount"
                placeholder="Amount in gram"
              />
            </ion-col>
            <ion-col size="2">
              <ion-button expand="block" color="medium" fill="outline" @click="adjustAmount('+')">
                <ion-icon slot="icon-only" :icon="add"></ion-icon>
              </ion-button>
            </ion-col>
          </ion-row>
        </ion-grid>
      </ion-item>
    </ion-list>
    <ion-row responsive-sm>
      <ion-col>
        <ion-button type="submit" @click="trackItem" expand="block">Track it</ion-button>
      </ion-col>
    </ion-row>
  </ion-content>
</template>

<script>
import {
  IonContent,
  IonHeader,
  IonTitle,
  IonToolbar,
  IonButton,
  IonButtons,
  IonGrid,
  IonRow,
  IonCol,
  IonList,
  IonItem,
  IonInput,
  IonIcon,
  modalController,
  toastController,
} from "@ionic/vue";
import { defineComponent } from "vue";

import VueApexCharts from "vue3-apexcharts";

import { getDailyCalories } from "@/service/StatsService.js";
import { trackCalories } from "@/service/ProductService.js";
import { add, remove, close } from "ionicons/icons";

export default defineComponent({
  name: "ModalAddCalories",
  components: {
    IonContent,
    IonHeader,
    IonTitle,
    IonToolbar,
    IonButton,
    IonButtons,
    IonGrid,
    IonRow,
    IonCol,
    IonList,
    IonItem,
    IonInput,
    IonIcon,
    apexchart: VueApexCharts
  },
  props: {
    item: { type: Object, default: null },
  },
  data() {
    return {
      amount: 100,
      userData: null,
      series: [0, 0, 0, 0],
      chartOptions: {
        chart: {
          id: 'vuechart-example',
          toolbar: {
            show: false
          },
        },
        plotOptions: {
          radialBar: {
            offsetY: 0,
            startAngle: 0,
            endAngle: 270,
            hollow: {
              margin: 5,
              size: '30%',
              background: 'transparent',
              image: undefined,
            },
            dataLabels: {
              name: {
                show: false,
              },
              value: {
                show: false,
              }
            }
          }
        },
        legend: {
          show: true,
          floating: true,
          fontSize: '16px',
          position: 'left',
          offsetX: 30,
          offsetY: 0,
          labels: {
            useSeriesColors: true,
          },
          markers: {
            size: 0
          },
          itemMargin: {
            vertical: 3
          }
        },
        colors: ['#3880ff', '#2dd36f', '#ffc409', '#eb445a'],
        labels: ['Calories', 'Protein', 'Carbs', 'Fat'],
      
      },
    };
  },
  setup() {
    return {
      add, remove, close
    };
  },
  async created() {

    const data = await getDailyCalories();
    
    if (data != null) {
      this.userData = data;
      this.updatePreviewData();
    }
  },
  methods: {
    async dismissModal() {
      const modal = await modalController.getTop();
      modal.dismiss();
    },
    async showToast(msg) {
      const toast = await toastController.create({
        message: msg,
        duration: 2000,
      });
      toast.present();
    },
    updatePreviewData() {

        if (this.amount < 0) {
          return;
        }

        var valueToPercent = function (value, max) {
          let tmp = (value * 100) / max;
          if (tmp > 100) {
            return 100;
          } else if (tmp < 0) {
            return 0;
          } else {
            return tmp;
          }
        }

        var item = this.$props.item;

        let calculatedCalories = item.calories * this.amount / 100;
        let calculatedCarbohydrate = item.carbohydrate * this.amount / 100;
        let calculatedFat = item.fat * this.amount / 100;
        let calculatedProtein = item.protein * this.amount / 100;

        this.series = [ valueToPercent(this.userData.calories + calculatedCalories, this.userData.user.calories),
                        valueToPercent(this.userData.protein +calculatedProtein, this.userData.user.protein),
                        valueToPercent(this.userData.carbohydrate +calculatedCarbohydrate, this.userData.user.carbohydrate),
                        valueToPercent(this.userData.fat +calculatedFat, this.userData.user.fat) ]
    }, 
    adjustAmount(mode) {
      let tmp = parseFloat(this.amount) 

      if (mode == "+") {
        tmp += 1;
      } else {
        tmp -= 1;
        if (tmp < 0) {
          tmp = 0;
        }
      }
      
      this.amount = tmp.toFixed(0);
    },
    async trackItem() {
      var item = this.$props.item;

      if (this.amount == "" || this.amount <= 0 || item == null) {
        this.showToast("Couldn't track item. Invalid input.");
        return;
      } 

      var tracked = await trackCalories({
        name: item.name,
        brand: item.brand,
        calories: item.calories,
        carbohydrate: item.carbohydrate,
        fat: item.fat,
        protein: item.protein,
        gramm: parseInt(this.amount),
      });

      if (tracked) {
        this.showToast("Item tracked.");
        this.dismissModal();
      } else {
        this.showToast("Couldn't track item.");
      }
    },
  },
   watch: {
    amount(newVal) {
      if (newVal < 0) {
        this.amount = 0;
      }
      this.updatePreviewData();
    }
   }
});
</script>