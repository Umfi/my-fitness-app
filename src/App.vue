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
          <ion-item disabled>Settings</ion-item>
          <ion-item @click="logout">Logout</ion-item>
        </ion-list>
      </ion-content>
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
  menuController,
} from "@ionic/vue";
import { defineComponent } from "vue";

import { logout, isLoggedIn } from "./service/AuthService.js";


import { config } from "./config.js";
import $axios from "./axios.js";

import { Plugins } from "@capacitor/core";


const { App } = Plugins;

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
  },
});
</script>