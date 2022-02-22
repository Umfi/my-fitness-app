<template>
      <ion-card v-show="!loadingCard" ref="card">
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
            ref="weightChart"
            width="100%"
            height="300"
            type="line"
            :options="weightChartOptions"
            :series="weightSeries"
          ></apexchart>
        </ion-card-content>
      </ion-card>

      <ion-card v-if="loadingCard">
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
  IonCardSubtitle,
  IonSkeletonText,
  IonThumbnail
} from "@ionic/vue";

import { createGesture } from '@ionic/vue';

import { getWeightSummary } from "@/service/StatsService";

import { ApexOptions } from "apexcharts";
import VueApexCharts, { VueApexChartsComponent } from "vue3-apexcharts";

export default defineComponent({
  name: "WeightCard",
  emits: ["pushed"],
  components: {
    IonCard,
    IonCardHeader,
    IonCardContent,
    IonCardTitle,
    IonCardSubtitle,
    IonSkeletonText,
    IonThumbnail,
    apexchart: VueApexCharts,
  },
  setup(_, context) {
    const card = ref();

    let weightChartOptions = ref<ApexOptions>({
        chart: {
          id: 'vuechart-weight',
          toolbar: {
            show: false
          },
        },
        theme: {
           mode: document.body.classList.contains("dark") ? 'dark' : 'light' 
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
        }
      });
    
    let weightSeriesTitle = ref("Month Year");
    let weightSeries = ref(
      [
        {
          name: "Weight",
          data: [1,1,1,1,1,1,1],
        },
      ]
    );
    let loadingCard = ref(true);

    async function loadMonthlyWeightSummary(month: number, year: number) {

      const data = await getWeightSummary(month, year);

      if (data != null) {

        var arr = [] as Array<number>;
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

        weightSeriesTitle.value = current.toLocaleString('default', { month: 'long' }) + " " + year;
        weightSeries.value[0].data = arr;
        
        loadingCard.value = false;
        setTimeout(() => {
            const weightChart = ref();
            if (weightChart.value) {
                (weightChart.value as VueApexChartsComponent).updateSeries(weightSeries.value[0].data, true);
                if (weightChartOptions.value.theme){
                    weightChartOptions.value.theme.mode = document.body.classList.contains("dark") ? 'dark' : 'light';
                }
                (weightChart.value as VueApexChartsComponent).updateOptions(weightChartOptions.value);                
            }
        }, 500);

        return true;
      }

      return false;
    }

    function reload(month: number, year: number) {
      loadingCard.value = true;
      loadMonthlyWeightSummary(month, year);
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
      const current = new Date();
      await loadMonthlyWeightSummary(current.getMonth() + 1, current.getFullYear());

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
         card, loadingCard, weightSeries, weightSeriesTitle, weightChartOptions, reload
     }
  }
})
</script>