<template>
  <ion-page>
    <ion-header :translucent="true">
      <ion-toolbar>
        <ion-title>Track weight</ion-title>
      </ion-toolbar>
    </ion-header>

    <ion-content :fullscreen="true">
      
    </ion-content>
  </ion-page>
</template>

<script lang="ts">
import {
  IonContent,
  IonHeader,
  IonPage,
  IonTitle,
  IonToolbar,
  modalController,
} from "@ionic/vue";
import { defineComponent } from "vue";

import ModalTrackWeight from "../tabs/Overview/ModalTrackWeight.vue";

export default defineComponent({
  name: "Track Weight",
  components: {
    IonContent,
    IonHeader,
    IonPage,
    IonTitle,
    IonToolbar
  },
  created() {
    this.trackWeight();
  },
  methods: {
    async trackWeight() {

      const modal = await modalController
        .create({
          component: ModalTrackWeight,
           componentProps: {
            parent: this
          },
        })

      modal.onDidDismiss().then(() => {
        this.$router.replace("/tabs/overview");
      });
      
      return modal.present();
    },
  }
});
</script>
