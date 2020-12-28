<template>
  <ion-header translucent>
    <ion-toolbar>
      <ion-title>How much grams?</ion-title>
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
          placeholder="Amount in gram"
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

import { trackCalories } from "@/service/ProductService.js";

export default defineComponent({
  name: "ModalAddCalories",
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
    item: { type: Object, default: null },
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
      var item = this.$props.item;

      if (this.amount == "" || this.amount <= 0 || item == null) {
        this.showToast("Couldn't track item. Invalid input.");
        return;
      } 

      var tracked = await trackCalories({
        name: item.name,
        brand: item.brand,
        calories: item.calories,
        carbohydrate: item.carbohydrate,
        fat: item.fat,
        protein: item.protein,
        gramm: parseInt(this.amount),
      });

      if (tracked) {
        this.showToast("Item tracked.");
        this.dismissModal();
      } else {
        this.showToast("Couldn't track item.");
      }
    },
  }
});
</script>