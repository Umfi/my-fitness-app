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

    <ion-content>
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
  modalController,
} from "@ionic/vue";

import { config } from "../config.js";
import $axios from "../axios.js";

import VueCal from "vue-cal";
import "vue-cal/dist/vuecal.css";
import ModalManageWorkout from "./ModalManageWorkout.vue";

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
    VueCal,
  },
  data() {
    return {
      selectedDate: null,
      events: [],
    };
  },
  ionViewWillEnter() {
    this.doRefresh(false);
  },
  methods: {
    doRefresh(event) {
      $axios
        .get(config.API_BASE_URL + "trainings")
        .then((response) => {
          if (response.data) {
            this.events = response.data;
            if (event) event.target.complete();
          }
        })
        .catch(() => {
          setTimeout(() => {
            this.doRefresh(event);
          }, 1000);
        });
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