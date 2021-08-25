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
  </ion-content>
  <ion-footer>
    <ion-row responsive-sm>
      <ion-col>
        <ion-button type="submit" @click="trackItem" expand="block">Track it</ion-button>
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
    IonList,
    IonFooter
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
      increment: 0.1,
      multiplier: 1,
      counter: 0
    };
  },
  async mounted() {
    const userData = await getUserData();
    if (userData != null) {
      this.amount = userData.details.weight;
    }

    let timer;
    let that = this;
    const gestureDec = createGesture({
      el: document.querySelector('.decBtn'),
      threshold: 0,
        onStart: () => { 
            that.increment = 0.1;
            that.multiplier = 1;
            that.counter = 0;

            timer = setInterval(function(){ 
              that.adjustWeight('-');
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


    const gestureInc = createGesture({
      el: document.querySelector('.incBtn'),
      threshold: 0,
        onStart: () => {   
            that.increment = 0.1;
            that.multiplier = 1;
            that.counter = 0;

            timer = setInterval(function(){ 
              that.adjustWeight('+');
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

      this.counter++;

      if (this.counter >= 10 && this.multiplier < 4) {
        this.multiplier++;
        this.increment = this.increment * this.multiplier;
        this.counter = 0;
      }
      
      if (mode == "+") {
        tmp += this.increment;
      } else {
        tmp -= this.increment;
      }
      
      if (tmp < 0) 
        tmp = 0;

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