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

import VueCal from "vue-cal";
import "vue-cal/dist/vuecal.css";
import ModalManageWorkout from "./ModalManageWorkout.vue";

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
      renderContent: false,
      selectedDate: null,
      events: [],
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
  methods: {
    async doRefresh(event) {

      const workouts = await getAllWorkouts();

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

      const modal = await modalController.create({
        component: ModalManageWorkout,
        componentProps: {
          item: {
            id: event.id,
            shoulders: event.shoulders,
            chest: event.chest,
            back: event.back,
            arms: event.arms,
            legs: event.legs,
            abs: event.abs,
            cardio: event.cardio,
          },
          title: "Edit a workout",
          mode: "edit",
          parent: this,
        },
      });
      return modal.present();
    },
    async onDateClick(event) {
      this.selectedDate = event;

      const modal = await modalController.create({
        component: ModalManageWorkout,
        componentProps: {
          item: {
            date: this.selectedDate.format(),
          },
          title: "Track workout",
          mode: "create",
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