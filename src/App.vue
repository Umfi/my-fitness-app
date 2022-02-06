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
          <ion-item detail @click="intervalTimer">Interval Timer</ion-item>
          <ion-item @click="logout">Logout</ion-item>
        </ion-list>
      </ion-content>
      <ion-footer class="bar-stable">
          <ion-item lines="full">
            <ion-icon slot="start" :icon="moon"></ion-icon>
            <ion-label>
              Toggle Dark Theme
            </ion-label>
            <ion-toggle @ionChange="changeTheme($event.detail.checked)" :checked="theme == 'dark'" slot="end"></ion-toggle>
          </ion-item>
          <ion-item>
            <ion-label>{{ version }}</ion-label>
            <ion-icon :icon="cloudDownloadOutline" slot="end" @click="updateApp"></ion-icon>
          </ion-item>
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
  IonIcon,
  IonLabel,
  IonToggle,
  menuController,
  toastController
} from "@ionic/vue";
import { defineComponent } from "vue";

import { cloudDownloadOutline, moon } from 'ionicons/icons';

import { logout, isLoggedIn, storeFCMToken } from "@/service/AuthService.js";

import { isPlatform } from '@ionic/vue';

import { PushNotifications } from '@capacitor/push-notifications';
import { Capacitor } from '@capacitor/core';

import { AppVersion } from '@ionic-native/app-version';
import { Downloader } from '@ionic-native/downloader';

import { get, set } from "@/helper/storage.js";



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
    IonFooter,
    IonIcon,
    IonLabel,
    IonToggle
  },
   data() {
    return {
      version: "",
      theme: "light"
    };
  },
   setup() {
    return {
      cloudDownloadOutline, moon
    }
  },
  async created() {
    
    let selectedTheme = await get("theme");
    if (selectedTheme == "dark") {
      this.theme = "dark";
      document.body.classList.add("dark");
    } else {
      this.theme = "light";
      document.body.classList.remove("dark");
    }

    if (Capacitor.isPluginAvailable('AppVersion')) {
      if (isPlatform('ios') || isPlatform('android')) {
        AppVersion.getVersionNumber().then(data => this.version = "Version " + data);
      }
    }
  },
  mounted() {
    if (Capacitor.isPluginAvailable('PushNotifications')) {
      PushNotifications.requestPermissions().then(result => {
          console.log('pushNotificationReceived permission:' + JSON.stringify(result));
          // Initialize the registration with FCM Token
          PushNotifications.register();
        });

        // On succcess, we should be able to receive notifications
        PushNotifications.addListener('registration', (token) => {
          console.log('pushNotification registration, token: ' + token.value);
          isLoggedIn().then((res) => {
            if (res) {
              storeFCMToken({"token": token.value});
            }
          });
        });

        // Method called when tapping on a notification
        PushNotifications.addListener('pushNotificationActionPerformed', async (notificationaction) => {
          console.log(`pushNotificationActionPerformed  ${JSON.stringify(notificationaction)}`);
          const data = notificationaction.notification.data;
          if (data.url) {
            this.$router.push("/" + data.url);
          }
        });
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
    logout: function () {
      logout()
        .then(() => {
          menuController.close();
          this.$router.push("/login");
        })
        .catch((err) => {
          console.log(err);
          logout(true).then(() => {
            menuController.close();
            this.$router.push("/login");
          })
        });
    },
    profile: function () {
      menuController.close();
      this.$router.push("/profile");
    },
    settings: function () {
      menuController.close();
      this.$router.push("/settings");
    },
    intervalTimer: function () {
      menuController.close();
      this.$router.push("/intervalTimer");
    },
    updateApp: function() {

      menuController.close();
      this.showToast("The latest version is being downloaded. However, you need to install it manually.");

      var request = {
          uri: "https://github.com/Umfi/my-fitness-app/releases/download/latest-build/myfitnessapp-latest.apk",
          title: 'MyFitnessApp.apk',
          description: 'Latest version of MyFitnessApp',
          visibleInDownloadsUi: true,
          notificationVisibility: 1,
          mimeType: '',
          destinationInExternalPublicDir: {
              dirType: 'Download',
              subPath: 'myfitnessapp-latest.apk'
          }
      };

      Downloader.download(request)
      .then((location) => console.log('File downloaded at:'+location))
      .catch((error) => console.error(error));
    },
    changeTheme(darkThemeOn) {
      if (darkThemeOn) {
        set("theme", "dark");
        this.theme = "dark";
        document.body.classList.add('dark');
      } else {
        set("theme", "light");
        this.theme = "light";
        document.body.classList.remove('dark');
      }
    },
  },
});
</script>