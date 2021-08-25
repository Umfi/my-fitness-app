<template>
  <ion-header translucent>
    <ion-toolbar>
      <ion-title>Manage Personal Records</ion-title>
      <ion-buttons slot="end">
        <ion-button @click="dismissModal">
          <ion-icon slot="icon-only" :icon="close"></ion-icon>
        </ion-button>
      </ion-buttons>
    </ion-toolbar>
  </ion-header>
  <ion-content fullscreen>
  <ion-list>
      <ion-item v-for="record in records" v-bind:key="record.id">
        <ion-grid>
          <ion-row>
            <ion-col size="7">
              <ion-input
                type="text"
                v-model="record.description"
                placeholder="Description"
              />
            </ion-col>
            <ion-col size="3">
              <ion-input
                type="number"
                v-model="record.value"
                placeholder="kg"
                min="0"
                max="300"
                step=".1"
              />
            </ion-col>
            <ion-col size="2">
              <ion-button expand="block" fill="solid" color="danger" @click="remove(record.id)">
                <ion-icon slot="icon-only" :icon="trash"></ion-icon>
              </ion-button>
            </ion-col>
          </ion-row>
        </ion-grid>
      </ion-item>
    </ion-list>

     <ion-fab vertical="bottom" horizontal="end" slot="fixed">
      <ion-fab-button @click="addRecord">
        <ion-icon :icon="add"></ion-icon>
      </ion-fab-button>
    </ion-fab>

  </ion-content>
  <ion-footer>
    <ion-row responsive-sm>
      <ion-col>
        <ion-button type="submit" @click="saveRecords" expand="block">Save</ion-button>
      </ion-col>
    </ion-row>
  </ion-footer>
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
  IonItem,
  IonInput,
  IonIcon,
  IonGrid,
  IonList,
  IonFooter,
  IonFabButton,
  IonFab,
  modalController,
  toastController,
} from "@ionic/vue";
import { defineComponent } from "vue";

import { storePersonalRecords, getPersonalRecords } from "@/service/StatsService.js";
import { close, trash, add } from "ionicons/icons";


export default defineComponent({
  name: "ModalTrackRecord",
  components: {
    IonContent,
    IonHeader,
    IonTitle,
    IonToolbar,
    IonButton,
    IonButtons,
    IonRow,
    IonCol,
    IonItem,
    IonInput,
    IonIcon,
    IonGrid,
    IonList,
    IonFooter,
    IonFabButton,
    IonFab
  },
  props: {
    parent: { type: Object, default: null },
  },
  setup() {
    return {
    close, trash, add
    };
  },
  data() {
    return {
      newID: 0,
      records: []
    };
  },
  async mounted() {
    const data = await getPersonalRecords();
    if (data != null) {
      this.records = data;
      this.newID = this.records.length + 1;
    }
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
    remove(id) {
        this.records = this.records.filter(function(record) {
            return record.id != id;
        });
    },
    addRecord() {
        this.newID = this.newID + 1;
        const newRecord = { 
            id: this.newID,
            description: '',
            value: ''
        };
        this.records.push(newRecord);
    },
    async saveRecords() {
 
      const invalidRecordDescription = this.records.filter(function(record) {
            return record.description.trim() == "";
      });
      if (invalidRecordDescription.length > 0) {
        this.showToast("Couldn't store personal records. Invalid description.");
        return;
      }

      const invalidRecordValue = this.records.filter(function(record) {
            return record.value.trim() == "" || record.value <= 0 || record.value >= 500 ;
      });
      if (invalidRecordValue.length > 0) {
        this.showToast("Couldn't store personal records. Invalid value.");
        return;
      }

      var tracked = await storePersonalRecords({
        records: this.records,
      });

      if (tracked) {
        this.$props.parent.doRefresh(false);
        this.showToast("Personal records saved.");
        this.dismissModal();
      } else {
        this.showToast("Couldn't save personal records.");
      }
    },
  }
});
</script>