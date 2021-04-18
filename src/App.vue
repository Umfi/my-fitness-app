<template>
  <ion-app>
    <ion-menu side="start" menu-id="first" content-id="main">
      <ion-header>
        <ion-toolbar color="primary">
          <ion-title>Menu</ion-title>
        </ion-toolbar>
      </ion-header>
      <ion-content>
        <ion-list>
          <ion-item detail @click="profile">Profile</ion-item>
          <ion-item detail @click="settings">Settings</ion-item>
          <ion-item @click="logout">Logout</ion-item>
        </ion-list>
      </ion-content>
      <ion-footer class="bar-stable">
          <ion-item>{{ version }}</ion-item>
      </ion-footer>
    </ion-menu>

    <ion-router-outlet id="main" />
  </ion-app>
</template>

<script>
import {
  IonApp,
  IonRouterOutlet,
  IonMenu,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonList,
  IonItem,
  IonFooter,
  menuController,
} from "@ionic/vue";
import { defineComponent } from "vue";

import { logout, isLoggedIn, storeFCMToken } from "@/service/AuthService.js";


import { config } from "@/config.js";
import $axios from "@/helper/axios.js";

import { Plugins } from "@capacitor/core";
import { isPlatform } from '@ionic/vue';
import { AppVersion } from '@ionic-native/app-version';
import { FCM } from '@capacitor-community/fcm';

const { App, PushNotifications } = Plugins;


App.addListener("appStateChange", (state) => {
  if (state.isActive) {
    isLoggedIn().then((res) => {
      if (res) {
        $axios.get(config.API_BASE_URL + "heartbeat");
      }
    });
  }
});

export default defineComponent({
  name: "App",
  components: {
    IonApp,
    IonRouterOutlet,
    IonMenu,
    IonHeader,
    IonToolbar,
    IonTitle,
    IonContent,
    IonList,
    IonItem,
    IonFooter
  },
   data() {
    return {
      version: ""
    };
  },
  created() {
    if (isPlatform('ios') || isPlatform('android')) {

      AppVersion.getVersionNumber().then(data => this.version = "Version " + data);

      const fcm = new FCM();
      try {
        
        PushNotifications.addListener("registrationError", (error) => {
          console.log(`error on register ${JSON.stringify(error)}`);
        });

        PushNotifications.addListener("pushNotificationReceived", (notification) => {
            console.log(`notification ${JSON.stringify(notification)}`);
        });

        PushNotifications.addListener("pushNotificationActionPerformed", async (notificationaction) => {
            console.log(`notificationaction  ${JSON.stringify(notificationaction)}`);
            var data = notificationaction.notification.data;
            this.$router.push(data.url);
        });

        PushNotifications.register();
  
        fcm.getToken().then(r => {
          isLoggedIn().then((res) => {
            if (res) {
              console.log(`FCM-Token ${r.token}`)
              storeFCMToken({"token": r.token});
            }
          });
        })
  
      } catch (e) {
        console.log(e);
      }
    }
     
  },
  methods: {
    logout: function () {
      logout()
        .then(() => {
          menuController.close();
          this.$router.push("/login");
        })
        .catch((err) => console.log(err));
    },
    profile: function () {
      menuController.close();
      this.$router.push("/profile");
    },
    settings: function () {
      menuController.close();
      this.$router.push("/settings");
    },
  },
});
</script>