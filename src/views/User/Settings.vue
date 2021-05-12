<template>
  <ion-page>
    <ion-header :translucent="true">
      <ion-toolbar>
        <ion-buttons slot="start">
          <ion-back-button></ion-back-button>
        </ion-buttons>

        <ion-title>Settings</ion-title>
      </ion-toolbar>
    </ion-header>

    <ion-content :fullscreen="true">
      <ion-card>
        <ion-card-header>
          <ion-card-title>Settings</ion-card-title>
        </ion-card-header>
        <ion-card-content>
            <ion-list>
              <ion-item-divider>
                <ion-label>Overview Settings</ion-label>
              </ion-item-divider>
              <ion-item>
                <ion-label>Calories Overview Card</ion-label>
                <ion-toggle 
                    slot="start"
                    @ionChange="updateSetting('showCard1', $event.target.checked)"
                    :checked="getSetting('showCard1')"
                ></ion-toggle>
              </ion-item>
              <ion-item>
                <ion-label>Water Consumption Card</ion-label>
                <ion-toggle 
                    slot="start"
                    @ionChange="updateSetting('showCard2', $event.target.checked)"
                    :checked="getSetting('showCard2')"
                ></ion-toggle>
              </ion-item>
              <ion-item>
                <ion-label>BMI Card</ion-label>
                <ion-toggle 
                    slot="start"
                    @ionChange="updateSetting('showCard3', $event.target.checked)"
                    :checked="getSetting('showCard3')"
                ></ion-toggle>
              </ion-item>
              <ion-item>
                <ion-label>Monthly Workout Summary Card</ion-label>
                <ion-toggle 
                    slot="start"
                    @ionChange="updateSetting('showCard4', $event.target.checked)"
                    :checked="getSetting('showCard4')"
                ></ion-toggle>
              </ion-item>
              <ion-item>
                <ion-label>Monthly Weight Summary Card</ion-label>
                <ion-toggle 
                    slot="start"
                    @ionChange="updateSetting('showCard5', $event.target.checked)"
                    :checked="getSetting('showCard5')"
                ></ion-toggle>
              </ion-item>
            </ion-list>
            <ion-item-divider>
                <ion-label>Push Notifications</ion-label>
              </ion-item-divider>
              <ion-item>
                <ion-label>Daily Weight Tracking Reminder</ion-label>
                <ion-toggle slot="start"
                    @ionChange="updateSetting('weightTrackingReminder', $event.target.checked)"
                    :checked="getSetting('weightTrackingReminder')"
                ></ion-toggle>
              </ion-item>

           
        </ion-card-content>
      </ion-card>
    </ion-content>
  </ion-page>
</template>

<script>
import {
  IonContent,
  IonHeader,
  IonPage,
  IonTitle,
  IonToolbar,
  IonCard,
  IonCardHeader,
  IonCardContent,
  IonCardTitle,
  IonLabel,
  IonItem,
  IonList,
  IonButtons,
  IonBackButton,
  IonItemDivider,
  IonToggle,
  toastController,
  loadingController,
} from "@ionic/vue";
import { defineComponent } from "vue";

import { getUserData, updateUserSetting } from "@/service/UserService.js";

export default defineComponent({
  name: "Profile",
  components: {
    IonContent,
    IonHeader,
    IonPage,
    IonTitle,
    IonToolbar,
    IonCard,
    IonCardHeader,
    IonCardContent,
    IonCardTitle,
    IonLabel,
    IonItem,
    IonList,
    IonButtons,
    IonBackButton,
    IonItemDivider,
    IonToggle
  },
  data() {
    return {
      settings: null,
    };
  },
  async created() {
    const userData = await getUserData();
    
    if (userData != null && userData.details != null) {
        this.settings = JSON.parse(userData.details.settings);
    }
  },
  methods: {
    async showToast(msg) {
      const toast = await toastController.create({
        message: msg,
        duration: 2000,
      });
      toast.present();
    },
    async showLoading() {
      const loading = await loadingController.create({
        message: "Please wait...",
      });

      await loading.present();
    },
    getSetting(key) {
        if (this.settings != null) {
            if (key in this.settings) {
                var returnVal = this.settings[key];
                if (returnVal === true) {
                    return true;
                } else {
                    return false;
                }
            }
        }

        return false;
    },
    async updateSetting(key, value) {
        var data = { 
            "key": key, 
            "value": value 
        };
        const result = await updateUserSetting(data);
    
        if (!result) {
            this.showToast("Something went wrong. Could not update setting.")
        }
    }
  },
});
</script>
