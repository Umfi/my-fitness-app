<template>
  <ion-header translucent>
    <ion-toolbar>
      <ion-title>How much do you weigh?</ion-title>
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
              <ion-button expand="block" class="decBtn" color="medium" fill="outline" @click="adjustWeight('-')">
                <ion-icon slot="icon-only" :icon="remove"></ion-icon>
              </ion-button>
            </ion-col>
            <ion-col size="8">
              <ion-input
                type="number"
                v-model="amount"
                placeholder="Amount in kg"
                min="0"
                max="200"
                step=".1"
              />
            </ion-col>
            <ion-col size="2">
              <ion-button expand="block" class="incBtn" color="medium" fill="outline" @click="adjustWeight('+')">
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
  IonRow,
  IonCol,
  IonItem,
  IonInput,
  IonIcon,
  IonGrid,
  IonList,
  modalController,
  toastController,
} from "@ionic/vue";
import { defineComponent } from "vue";

import { trackWeight, getUserData } from "@/service/UserService.js";
import { add, remove, close } from "ionicons/icons";
import { createGesture } from '@ionic/vue';


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
    IonItem,
    IonInput,
    IonIcon,
    IonGrid,
    IonList
  },
  props: {
    parent: { type: Object, default: null },
  },
  setup() {
    return {
      add, remove, close
    };
  },
  data() {
    return {
      amount: null,
    };
  },
  async created() {
    const userData = await getUserData();
    if (userData != null) {
      this.amount = userData.details.weight;
    }

    let timer;
    const decBtn = document.querySelector('.decBtn');
    const gestureDec = createGesture({
      el: decBtn,
      threshold: 0,
        onStart: () => {                                       
            timer = setInterval(function(){ 
              decBtn.click();
            }, 100);
        },
        onMove: (detail) => { 
           if (detail.deltaX <= 10 && detail.deltaY <= 10) {
              return;
            }

            if (timer) {
              clearInterval(timer);
              timer = undefined;
            }
        },
        onEnd: () => {                
            if (timer) {
              clearInterval(timer);
              timer = undefined;
            }
        }
    });

    gestureDec.enable(true);

    

    const incBtn = document.querySelector('.incBtn');
    const gestureInc = createGesture({
      el: incBtn,
      threshold: 0,
        onStart: () => {                                       
            timer = setInterval(function(){ 
              incBtn.click();
            }, 100);
        },
        onMove: (detail) => { 
           if (detail.deltaX <= 10 && detail.deltaY <= 10) {
              return;
           }
           
            if (timer) {
              clearInterval(timer);
              timer = undefined;
            }
        },
        onEnd: () => {                
            if (timer) {
              clearInterval(timer);
              timer = undefined;
            }
        }
    });

    gestureInc.enable(true);
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
    adjustWeight(mode) {
      let tmp = parseFloat(this.amount) 

      if (mode == "+") {
        tmp += 0.1;
      } else {
        tmp -= 0.1;
      }
      
      this.amount = tmp.toFixed(1);
    },
    async trackItem() {
 
      if (this.amount == "" || this.amount <= 0 || this.amount >= 200) {
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