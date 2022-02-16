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
              <ion-button ref="decBtn" expand="block" class="decBtn" color="medium" fill="outline" @click="adjustAmount('-')">
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
              <ion-button ref="incBtn" expand="block" class="incBtn" color="medium" fill="outline" @click="adjustAmount('+')">
                <ion-icon slot="icon-only" :icon="add"></ion-icon>
              </ion-button>
            </ion-col>
          </ion-row>
        </ion-grid>
      </ion-item>
    </ion-list>
  </ion-content>
  <ion-footer>
    <ion-row responsive-sm>
      <ion-col>
        <ion-button type="submit" @click="trackItem" expand="block">Track it</ion-button>
      </ion-col>
    </ion-row>
  </ion-footer>
</template>

<script lang="ts">
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
  IonFooter,
  modalController,
  GestureDetail,
} from "@ionic/vue";
import { defineComponent, onMounted, ref, watch } from "vue";

import VueApexCharts from "vue3-apexcharts";

import { DailyCaloriesModel, getDailyCalories } from "@/service/StatsService";
import { SearchResultModel, trackCalories } from "@/service/ProductService";
import { add, remove, close } from "ionicons/icons";

import { showToast } from "@/utils";
import { createGesture } from '@ionic/vue';

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
    IonFooter,
    apexchart: VueApexCharts
  },
  props: {
    item: { type: Object, default: null },
    parent: { type: Object, default: null },
  },
  data() {
    return {
      chartOptions: {
        chart: {
          id: 'calories-consumtion-chart',
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
  setup(props) {
    const decBtn = ref();
    const incBtn = ref();

    let amount = ref(100);
    let userData = null as DailyCaloriesModel | null;
    let series = ref([0, 0, 0, 0]);

    let increment = 1;
    let multiplier = 1;
    let counter = 0;
    let timer: number | undefined;
    
    watch(amount, function(newVal) {
      if (newVal < 0) {
        amount.value = 0;
      }
      updatePreviewData();
    })

    async function dismissModal() {
      const modal = await modalController.getTop();
      modal.dismiss();
    }

    function adjustAmount(mode: string) {
      let tmp: number;
      tmp = amount.value;
      tmp = parseInt("" + tmp);

      if (tmp) {
        counter++;

        if (counter >= 10 && multiplier < 4) {
          multiplier++;
          increment = increment * multiplier;
          counter = 0;
        }

        if (mode == "+") {
          tmp += increment;
        } else {
          tmp -= increment;
        }
        
        if (tmp < 0) 
          tmp = 0;

        amount.value = tmp;
      }
    }

    function updatePreviewData() {

        if (amount.value < 0 || userData === null) {
          return;
        }

        var valueToPercent = function (value: number, max: number) {
          let tmp = (value * 100) / max;
          if (tmp > 100) {
            return 100;
          } else if (tmp < 0) {
            return 0;
          } else {
            return tmp;
          }
        }

        var item = props.item as SearchResultModel;

        let calculatedCalories = item.calories * amount.value / 100;
        let calculatedCarbohydrate = item.carbohydrate * amount.value / 100;
        let calculatedFat = item.fat * amount.value / 100;
        let calculatedProtein = item.protein * amount.value / 100;

        series.value = [ valueToPercent(userData.calories + calculatedCalories, userData.user.calories),
                        valueToPercent(userData.protein + calculatedProtein, userData.user.protein),
                        valueToPercent(userData.carbohydrate + calculatedCarbohydrate, userData.user.carbohydrate),
                        valueToPercent(userData.fat + calculatedFat, userData.user.fat) ]
                        
    }

    async function trackItem() {
     var item = props.item as SearchResultModel;

      if (amount.value <= 0 || item == null) {
        showToast("Couldn't track item. Invalid input.");
        return;
      } 

      var tracked = await trackCalories({
        name: item.name,
        brand: item.brand,
        calories: item.calories,
        carbohydrate: item.carbohydrate,
        fat: item.fat,
        protein: item.protein,
        gramm: amount.value,
      });

      if (tracked) {
        showToast("Item tracked.");
        props.parent.doRefresh();
        dismissModal();
      } else {
        showToast("Couldn't track item.");
      }
    }

    let longPressActive = false;
    let timer2: number | undefined;

    function gestureStart(mode: string) {
      longPressActive = true;

      timer2 = setTimeout(function () {
          if (longPressActive === true) {
            increment = 1;
            multiplier = 1;
            counter = 0;
            timer = setInterval(function(){ 
              if (longPressActive === true) {
                adjustAmount(mode);
              }
            }, 100);
          }
      }, 600);
    }

    function gestureMove(detail: GestureDetail) {
      if (detail.deltaX <= 10 && detail.deltaY <= 10) {
        return;
      }

      longPressActive = false;
    }

    function gestureEnd() {

      longPressActive = false;
      if (timer2) {
        clearInterval(timer2);
        timer2 = undefined;
      }

      increment = 1;
      multiplier = 1;
      counter = 0;
      if (timer) {
        clearInterval(timer);
        timer = undefined;
      }
    }

    onMounted(async () => {

      const data = await getDailyCalories();
    
      if (data !== null) {
          userData = data;
          updatePreviewData();
       }

      const gestureDec = createGesture({
        gestureName: 'decrease-longpress',
        el: decBtn.value.$el,
        threshold: 0,
          onStart: () => { gestureStart("-") },
          onMove: (detail) => { gestureMove(detail) },
          onEnd: () => { gestureEnd() }
      });
      gestureDec.enable(true);

      const gestureInc = createGesture({
        gestureName: 'increase-longpress',
        el: incBtn.value.$el,
        threshold: 0,
        onStart: () => { gestureStart("+") },
        onMove: (detail) => { gestureMove(detail) },
        onEnd: () => { gestureEnd() }
      });
      gestureInc.enable(true);

     });

    return {
      add, remove, close, decBtn, incBtn, amount, series, dismissModal, trackItem, adjustAmount
    };
  }
});
</script>