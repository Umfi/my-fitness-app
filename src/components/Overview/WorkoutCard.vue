<template>
      <ion-card v-show="!loadingCard" ref="card">
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
            ref="workoutChart"
            width="100%"
            height="300"
            type="bar"
            :options="chartOptions"
            :series="series"
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

import { getMonthlyWorkoutSummary } from "@/service/StatsService";

import { ApexOptions } from "apexcharts";
import VueApexCharts, { VueApexChartsComponent } from "vue3-apexcharts";

export default defineComponent({
  name: "WorkoutCard",
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

    let chartOptions = ref<ApexOptions>({
        chart: {
          id: 'vuechart-workouts',
          toolbar: {
            show: false
          },
        },
        theme: {
            mode: document.body.classList.contains("dark") ? 'dark' : 'light' 
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
        yaxis: [
        {
          labels: {
            formatter: function(val) {
              return val.toFixed(0);
            }
          }
        }
      ]
    });
    
    let workoutSeriesTitle = ref("Month Year");
    let series = ref(
      [
        {
          name: "Workouts",
          data: [1,1,1,1,1,1,1],
        },
      ]
    );
    let loadingCard = ref(true);

    async function loadMonthlyWorkoutSummary(month: number, year: number) {

      const data = await getMonthlyWorkoutSummary(month, year);

      if (data != null) {
        const current = new Date();
        current.setMonth(month-1);

        workoutSeriesTitle.value = current.toLocaleString('default', { month: 'long' }) + " " + year;
        series.value[0].data = data;

        loadingCard.value = false;

        setTimeout(() => {
            const workoutChart = ref();
            if (workoutChart.value) {
                (workoutChart.value as VueApexChartsComponent).updateSeries(series.value[0].data, true);
                if (chartOptions.value.theme){
                    chartOptions.value.theme.mode = document.body.classList.contains("dark") ? 'dark' : 'light';
                }
                (workoutChart.value as VueApexChartsComponent).updateOptions(chartOptions.value);                
            }
        }, 500);

        return true;
      }

      return false;
    }

    function reload(month: number, year: number) {
      loadingCard.value = true;
      loadMonthlyWorkoutSummary(month, year);
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
      await loadMonthlyWorkoutSummary(current.getMonth() + 1, current.getFullYear());

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
         card, loadingCard, series, workoutSeriesTitle, chartOptions, reload
     }
  }
})
</script>