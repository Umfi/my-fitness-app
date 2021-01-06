<template>
  <ion-header translucent>
    <ion-toolbar>
      <ion-title>How much grams?</ion-title>
      <ion-buttons slot="end">
        <ion-button @click="dismissModal">
          <ion-icon slot="icon-only" :icon="close"></ion-icon>
        </ion-button>
      </ion-buttons>
    </ion-toolbar>
  </ion-header>
  <ion-content fullscreen>
    <ion-list>
      <ion-item>
        <ion-grid>
          <ion-row>
            <ion-col size="2">
              <ion-button expand="block" color="medium" fill="outline" @click="adjustAmount('-')">
                <ion-icon slot="icon-only" :icon="remove"></ion-icon>
              </ion-button>
            </ion-col>
            <ion-col size="8">
              <ion-input
                type="number"
                v-model="amount"
                placeholder="Amount in gram"
              />
            </ion-col>
            <ion-col size="2">
              <ion-button expand="block" color="medium" fill="outline" @click="adjustAmount('+')">
                <ion-icon slot="icon-only" :icon="add"></ion-icon>
              </ion-button>
            </ion-col>
          </ion-row>
        </ion-grid>
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
  IonGrid,
  IonRow,
  IonCol,
  IonList,
  IonItem,
  IonInput,
  IonIcon,
  modalController,
  toastController,
} from "@ionic/vue";
import { defineComponent } from "vue";

import { trackCalories } from "@/service/ProductService.js";
import { add, remove, close } from "ionicons/icons";

export default defineComponent({
  name: "ModalAddCalories",
  components: {
    IonContent,
    IonHeader,
    IonTitle,
    IonToolbar,
    IonButton,
    IonButtons,
    IonGrid,
    IonRow,
    IonCol,
    IonList,
    IonItem,
    IonInput,
    IonIcon
  },
  props: {
    item: { type: Object, default: null },
  },
  data() {
    return {
      amount: 100,
    };
  },
  setup() {
    return {
      add, remove, close
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
    adjustAmount(mode) {
      let tmp = parseFloat(this.amount) 

      if (mode == "+") {
        tmp += 1;
      } else {
        tmp -= 2;
      }
      
      this.amount = tmp.toFixed(0);
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