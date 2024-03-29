<template>
  <ion-header translucent>
    <ion-toolbar>
      <ion-title> {{ $props.title }}</ion-title>
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
        <ion-label position="stacked" color="primary">Product Name</ion-label>
        <ion-input
          v-model="name"
          type="text"
          spellcheck="false"
          autocapitalize="off"
          required
        ></ion-input>
      </ion-item>

      <ion-item>
        <ion-label position="stacked" color="primary">Calories</ion-label>
        <ion-input
          v-model="calories"
          type="number"
          placeholder="Value/100g"
          required
        ></ion-input>
      </ion-item>

      <ion-item>
        <ion-label position="stacked" color="primary">Protein</ion-label>
        <ion-input
          v-model="protein"
          type="number"
          placeholder="Value/100g"
          required
        ></ion-input>
      </ion-item>

      <ion-item>
        <ion-label position="stacked" color="primary">Carbohydrate</ion-label>
        <ion-input
          v-model="carbohydrate"
          type="number"
          placeholder="Value/100g"
          required
        ></ion-input>
      </ion-item>

      <ion-item>
        <ion-label position="stacked" color="primary">Fat</ion-label>
        <ion-input
          v-model="fat"
          type="number"
          placeholder="Value/100g"
          required
        ></ion-input>
      </ion-item>
    </ion-list>
  </ion-content>
  <ion-footer>
    <ion-row responsive-sm>
      <ion-col>
        <ion-button type="submit" @click="submitProductAction" expand="block">Submit</ion-button>
      </ion-col>
    </ion-row>
  </ion-footer>
</template>

<script lang="ts">
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
  IonLabel,
  IonIcon,
  IonFooter,
  modalController,
} from "@ionic/vue";
import { defineComponent } from "vue";

import { SearchResultModel, createProduct, updateProduct } from "@/service/ProductService";
import { close } from "ionicons/icons";
import { showToast } from "@/utils";


export default defineComponent({
  name: "ModalManageProduct",
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
    IonLabel,
    IonIcon,
    IonFooter
  },
  props: {
    item: { type: Object, default: null },
    title: { type: String },
    mode: { type: String, default: "create" },
    parent: { type: Object, default: null },
  },
  data() {
    return {
      name: "",
      calories: null as number | null,
      protein: null as number | null,
      carbohydrate: null as number | null,
      fat: null as number | null,
      id: -1,
    };
  },
  created() {
    if (this.$props.mode == "edit") {
      var item = this.$props.item as SearchResultModel;

      this.name = item.name;
      this.calories = item.calories;
      this.protein = item.protein;
      this.carbohydrate = item.carbohydrate;
      this.fat = item.fat;
      this.id = item.id;
    }
  },
  setup() {
    return {
      close
    };
  },
  methods: {
    async dismissModal() {
      const modal = await modalController.getTop();
      modal.dismiss();
    },
    async submitProductAction() {

      if (this.name == "" || this.calories == null || this.carbohydrate == null || this.fat == null || this.protein == null) {
        showToast("Couldn't perform action. Invalid input.");
        return;
      }

      if (this.$props.mode == "create") {
        const created = await createProduct({
          name: this.name,
          calories: this.calories,
          carbohydrate: this.carbohydrate,
          fat: this.fat,
          protein: this.protein,
        });

        if (created) {
          showToast("Product created.");
          this.$props.parent.doRefresh();
          this.dismissModal();
        } else {
          showToast("Couldn't create product.");
        }
      } else if (this.$props.mode == "edit") {
        const updated = await updateProduct({
          name: this.name,
          calories: this.calories,
          carbohydrate: this.carbohydrate,
          fat: this.fat,
          protein: this.protein,
          id: this.id,
        });

        if (updated) {
          showToast("Product updated.");
          this.$props.parent.doRefresh();
          this.dismissModal();
        } else {
          showToast("Couldn't update product.");
        }
      }
    },
  },
});
</script>