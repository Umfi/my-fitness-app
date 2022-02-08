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

    <ion-content v-show="renderContent">
      <ion-refresher slot="fixed" @ionRefresh="doRefresh($event)">
        <ion-refresher-content> </ion-refresher-content>
      </ion-refresher>

      <vue-cal
        ref="vuecal"
        :time="false"
        hide-view-selector
        :disable-views="['years', 'year', 'week', 'day']"
        active-view="month"
        events-on-month-view="short"
        :events="events"
        :cell-click-hold="false"
        :on-event-click="onEventClick"
        @cell-click="onDateClick"
        @view-change="doRefresh(false)"
      >
      </vue-cal>

      <ion-fab vertical="bottom" horizontal="end" slot="fixed">
        <ion-fab-button ref="addWorkoutBtn" @click="trackWorkout">
          <ion-icon :icon="add"></ion-icon>
        </ion-fab-button>
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
  IonFab,
  IonFabButton,
  IonIcon,
  modalController,
} from "@ionic/vue";

import { getAllWorkouts } from "@/service/WorkoutService.js";
import { get } from "@/helper/storage.js";


import VueCal from "vue-cal";
import "vue-cal/dist/vuecal.css";
import ModalManageWorkout from "./ModalManageWorkout.vue";
import ModalDetailedWorkout from "./ModalDetailedWorkout.vue";

import { add } from "ionicons/icons";

export default defineComponent({
  name: "Workouts",
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
    IonFab,
    IonFabButton,
    IonIcon,
    VueCal,
  },
  setup() {
    return {
      add
    };
  },
  data() {
    return {
      settings: null,
      renderContent: false,
      selectedDate: null,
      events: [],
      reloadAttempt: 0
    };
  },
  ionViewDidEnter() {
    this.renderContent = true;
    this.doRefresh(false);
  },
  ionViewWillLeave() {
    this.renderContent = false;
  },
  methods: {

    async doRefresh(event) {
      var startDate = this.$refs.vuecal.view.firstCellDate;
      var endDate = this.$refs.vuecal.view.lastCellDate;

      let workouts = await getAllWorkouts(startDate, endDate);
   
      if ((this.reloadAttempt < 5) && workouts == null) {
        this.reloadAttempt++;

        setTimeout(() => {
          this.doRefresh(event);
        }, 1000);
      } else {
        this.reloadAttempt = 0;

        this.events = workouts;
        if (event) event.target.complete();
      }
    },
    trackWorkout() {
      this.onDateClick(new Date());
    },
    async onEventClick(event, e) {
      // Prevent navigating to narrower view (default vue-cal behavior).
      e.stopPropagation();
      this.onDateClick(new Date(event.date))
    },
    async onDateClick(event) {
      this.selectedDate = event;
      let selectedModal = null;
      
      const isAdvancedTrainignsModeEnabled = await get("advancedTrainigMode");
      if (isAdvancedTrainignsModeEnabled) {
        selectedModal = ModalDetailedWorkout;
      } else {
        selectedModal = ModalManageWorkout;
      }

      const modal = await modalController.create({
        component: selectedModal,
        componentProps: {
          item: {
            date: this.selectedDate.format(),
          },
          title: "Track workout",
          parent: this,
        },
      });
      return modal.present();
    },
  },
});
</script>
<style scoped>
.scroll {
  height: 100%;
}
</style>