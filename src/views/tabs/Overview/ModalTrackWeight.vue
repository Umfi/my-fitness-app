<template>
  <ion-header translucent>
    <ion-toolbar>
      <ion-title>How much do you weigh?</ion-title>
      <ion-buttons slot="end">
        <ion-button @click="dismissModal">Close</ion-button>
      </ion-buttons>
    </ion-toolbar>
  </ion-header>
  <ion-content fullscreen>
    <ion-list>
      <ion-item>
        <ion-input
          type="number"
          v-model="amount"
          placeholder="Amount in kg"
        />
      </ion-item>
    </ion-list>

    <ion-row responsive-sm>
      <ion-col>
        <ion-button type="submit" @click="trackItem" expand="block">Track it</ion-button>
      </ion-col>
    </ion-row>
  </ion-content>
</template>

<script>
import {
  IonContent,
  IonHeader,
  IonTitle,
  IonToolbar,
  IonButton,
  IonButtons,
  IonRow,
  IonCol,
  IonList,
  IonItem,
  IonInput,
  modalController,
  toastController,
} from "@ionic/vue";
import { defineComponent } from "vue";

import { trackWeight } from "@/service/UserService.js";

export default defineComponent({
  name: "ModalTrackWeight",
  components: {
    IonContent,
    IonHeader,
    IonTitle,
    IonToolbar,
    IonButton,
    IonButtons,
    IonRow,
    IonCol,
    IonList,
    IonItem,
    IonInput,
  },
  props: {
    parent: { type: Object, default: null },
  },
  data() {
    return {
      amount: null,
    };
  },
  methods: {
    async dismissModal() {
      const modal = await modalController.getTop();
      modal.dismiss();
    },
    async showToast(msg) {
      const toast = await toastController.create({
        message: msg,
        duration: 2000,
      });
      toast.present();
    },
    async trackItem() {
 
      if (this.amount == "" || this.amount <= 0) {
        this.showToast("Couldn't track weight. Invalid input.");
        return;
      } 

      var tracked = await trackWeight({
        weight: this.amount,
      });

      if (tracked) {
        this.$props.parent.doRefresh(false);
        this.showToast("Weight tracked.");
        this.dismissModal();
      } else {
        this.showToast("Couldn't track weight.");
      }
    },
  }
});
</script>