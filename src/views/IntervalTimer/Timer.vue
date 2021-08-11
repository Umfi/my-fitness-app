<template>
  <ion-page>
    <ion-header :translucent="true">
      <ion-toolbar>
        <ion-buttons slot="start">
          <ion-back-button></ion-back-button>
        </ion-buttons>

        <ion-title>Interval Timer</ion-title>
      </ion-toolbar>
    </ion-header>

    <ion-content :fullscreen="true">
      <ion-grid>
        <ion-row class="ion-padding" v-show="showTimer">
          <ion-col class="ion-padding">
            <TimerComponent ref="timer" v-bind:sets="sets" v-bind:trainingtime="trainingtime" v-bind:breaktime="breaktime" />
          </ion-col>
        </ion-row>
        <ion-row v-show="!showTimer">
          <ion-col class="ion-padding">
            <ion-list>
              <ion-item>
                <ion-label position="stacked">Sets</ion-label>
                <ion-input v-model="sets" name="sets" type="number"></ion-input>
              </ion-item>
              <ion-item>
                <ion-label position="stacked">Training Time</ion-label>
                <ion-input v-model="trainingtime" name="trainingtime" type="number"></ion-input>
              </ion-item>
              <ion-item>
                <ion-label position="stacked">Break Time</ion-label>
                <ion-input v-model="breaktime" name="breaktime" type="number"></ion-input>
              </ion-item>
            </ion-list>
          </ion-col>
        </ion-row>
        <ion-row>
          <ion-col size="12">
            <ion-button type="submit" expand="block"  size="large"  @click="startTimer" v-show="!showTimer">Start</ion-button>
          </ion-col>
          <ion-col v-show="showTimer && this.$refs.timer.currentMode != 'DONE'">
              <ion-button type="submit" color="warning" size="large" expand="block" @click="pauseTimer" v-show="showTimer && !resumeBtnVis && this.$refs.timer.currentMode != 'DONE'">Pause</ion-button>
              <ion-button type="submit" color="success" size="large" expand="block" @click="resumeTimer" v-show="showTimer && resumeBtnVis && this.$refs.timer.currentMode != 'DONE'">Resume</ion-button>
          </ion-col>
          <ion-col>
             <ion-button type="submit" color="danger"  size="large" expand="block" @click="stopTimer" v-show="showTimer">Stop</ion-button>
          </ion-col>
        </ion-row>
      </ion-grid>
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
  IonBackButton,
  IonGrid,
  IonRow,
  IonCol,
  IonList,
  IonItem,
  IonLabel,
  IonInput,
  IonButton,
  toastController
} from "@ionic/vue";

import TimerComponent from "./TimerComponent";

import { Brightness } from '@ionic-native/brightness';

export default defineComponent({
  name: "Timer",
  components: {
    IonContent,
    IonHeader,
    IonPage,
    IonTitle,
    IonToolbar,
    IonButtons,
    IonBackButton,
    IonGrid,
    IonRow,
    IonCol,
    IonList,
    IonItem,
    IonLabel,
    IonInput,
    IonButton,
    TimerComponent
  },
  data() {
    return {
      showTimer: false,
      resumeBtnVis: false,
      sets: 10,
      trainingtime: 45,
      breaktime: 15
    };
  },
  ionViewDidEnter() {
    Brightness.setKeepScreenOn(true);
  },
  ionViewWillLeave() {
    this.stopTimer();
    Brightness.setKeepScreenOn(false);
  },
  methods: {
    async showToast(msg) {
      const toast = await toastController.create({
        message: msg,
        duration: 2000,
      });
      toast.present();
   },
   startTimer() {

     if (this.sets <= 0) {
        this.showToast("Number of sets must be at least 1");
        return;
     }

    if (this.trainingtime <= 0) {
        this.showToast("Training time must be at least 1");
        return;
     }

     if (this.breaktime <= 0) {
        this.showToast("Break time must be at least 1");
        return;
     }
     
     this.showTimer = true;
     this.resumeBtnVis = false;
     this.$refs.timer.initialTimerStart();
   },
   pauseTimer() {
    this.resumeBtnVis = true;
    this.$refs.timer.pauseTimer();
   },
   resumeTimer() {
    this.resumeBtnVis = false;
    this.$refs.timer.resumeTimer();
   },
   stopTimer() {
    this.showTimer = false;
    this.$refs.timer.stopTimer();
   }
  },
});
</script>
