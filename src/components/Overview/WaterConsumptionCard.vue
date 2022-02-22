<template>
        <ion-card v-show="!loadingCard" ref="card">
          <ion-card-header>
            <ion-card-title>
              Water Consumption
            </ion-card-title>
          </ion-card-header>
          <ion-card-content>
            <apexchart
                ref="waterChart"
                width="100%"
                height="300"
                type="radialBar"
                :options="waterChartOptions"
                :series="waterSeries"
            ></apexchart>
          </ion-card-content>
        </ion-card>

      <ion-card v-show="loadingCard">
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
</template>

<script lang="ts">
import { defineComponent, onMounted, ref } from "vue";
import {
  IonCard,
  IonCardHeader,
  IonCardContent,
  IonCardTitle,
  IonSkeletonText,
  IonThumbnail
} from "@ionic/vue";

import { createGesture } from '@ionic/vue';

import { getWaterConsumption } from "@/service/StatsService";

import { ApexOptions } from "apexcharts";
import VueApexCharts, { VueApexChartsComponent } from "vue3-apexcharts";

export default defineComponent({
  name: "WaterConsumptionCard",
  emits: ["pushed"],
  components: {
    IonCard,
    IonCardHeader,
    IonCardContent,
    IonCardTitle,
    IonSkeletonText,
    IonThumbnail,
    apexchart: VueApexCharts,
  },
  setup(_, context) {
    const card = ref();

    let waterChartOptions = ref<ApexOptions>({
          chart: {
            type: 'radialBar',
            offsetY: -20,
            sparkline: {
              enabled: true
            }
          },
          theme: {
            mode: document.body.classList.contains("dark") ? 'dark' : 'light'
          },
          plotOptions: {
            radialBar: {
              startAngle: -90,
              endAngle: 90,
              track: {
                background: "#e7e7e7",
                strokeWidth: '97%',
                margin: 5,
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
      });
    let waterSeries = ref([0]);
    let loadingCard = ref(true);

    async function loadDailyWaterConsumption() {
      
      const data = await getWaterConsumption();
      
      if (data !== null) {
        waterSeries.value = [data.waterConsumption];
        loadingCard.value = false;

        setTimeout(() => {
            const waterChart = ref();
        
            if (waterChart.value) {
                (waterChart.value as VueApexChartsComponent).updateSeries(waterSeries.value, true);

                if (waterChartOptions.value.theme){
                    waterChartOptions.value.theme.mode = document.body.classList.contains("dark") ? 'dark' : 'light';
                }

                (waterChart.value as VueApexChartsComponent).updateOptions(waterChartOptions.value);                
            }
        }, 500);
        
        return true;
      }

      return false;
    }

    function reload() {
      loadingCard.value = true;
      loadDailyWaterConsumption();
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
      await loadDailyWaterConsumption();

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
         card, loadingCard, waterSeries, waterChartOptions, reload
     }
  }
})
</script>