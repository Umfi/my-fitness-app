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
              <ion-button ref="decBtn" expand="block" class="decBtn" color="medium" fill="outline" @click="adjustWeight('-')">
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
              <ion-button ref="incBtn" expand="block" class="incBtn" color="medium" fill="outline" @click="adjustWeight('+')">
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
  IonItem,
  IonInput,
  IonIcon,
  IonGrid,
  IonList,
  IonFooter,
  modalController,
  GestureDetail,
} from "@ionic/vue";
import { defineComponent, onMounted, ref } from "vue";

import { trackWeight, getUserData } from "@/service/UserService";
import { add, remove, close } from "ionicons/icons";
import { createGesture } from '@ionic/vue';

import { showToast } from "@/utils";

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
  setup(props) {
    const decBtn = ref();
    const incBtn = ref();

    let amount = ref(100);

    let increment = 1;
    let multiplier = 1;
    let counter = 0;
    let timer: number | undefined;
    
    async function dismissModal() {
      const modal = await modalController.getTop();
      modal.dismiss();
    }

    function adjustWeight(mode: string) {
      let tmp: number;
      tmp = amount.value;
      tmp = parseFloat("" + tmp);

      if (tmp) {
        counter++;

        if (counter >= 10 && multiplier < 4) {
          multiplier++;
          increment = increment * multiplier;
          counter = 0;
        }

        if (mode == "+") {
          tmp += increment;
        } else {
          tmp -= increment;
        }
        
        if (tmp < 0) 
          tmp = 0;

        tmp = Math.round( tmp * 1e1 ) / 1e1

        amount.value = tmp;
      }
    }


    async function trackItem() {
 
      if (amount.value <= 0 || amount.value >= 200) {
        showToast("Couldn't track weight. Invalid input.");
        return;
      } 

      var tracked = await trackWeight({
        weight: amount.value,
      });

      if (tracked) {
        props.parent.doRefresh();
        showToast("Weight tracked.");
        dismissModal();
      } else {
        showToast("Couldn't track weight.");
      }
    }


    let longPressActive = false;
    let timer2: number | undefined;

    function gestureStart(mode: string) {
      longPressActive = true;

      timer2 = setTimeout(function () {
          if (longPressActive === true) {
            increment = 0.1;
            multiplier = 1;
            counter = 0;
            timer = setInterval(function(){ 
              if (longPressActive === true) {
                adjustWeight(mode);
              }
            }, 100);
          }
      }, 600);
    }

    function gestureMove(detail: GestureDetail) {
      if (detail.deltaX <= 10 && detail.deltaY <= 10) {
        return;
      }

      longPressActive = false;
    }

    function gestureEnd() {

      longPressActive = false;
      if (timer2) {
        clearInterval(timer2);
        timer2 = undefined;
      }

      increment = 0.1;
      multiplier = 1;
      counter = 0;
      if (timer) {
        clearInterval(timer);
        timer = undefined;
      }
    }

    onMounted(async () => {

      const userData = await getUserData();
      if (userData != null) {
        amount.value = userData.details.weight;
      }

      const gestureDec = createGesture({
        gestureName: 'decrease-longpress',
        el: decBtn.value.$el,
        threshold: 0,
          onStart: () => { gestureStart("-") },
          onMove: (detail) => { gestureMove(detail) },
          onEnd: () => { gestureEnd() }
      });
      gestureDec.enable(true);

      const gestureInc = createGesture({
        gestureName: 'increase-longpress',
        el: incBtn.value.$el,
        threshold: 0,
        onStart: () => { gestureStart("+") },
        onMove: (detail) => { gestureMove(detail) },
        onEnd: () => { gestureEnd() }
      });
      gestureInc.enable(true);

     });

    return {
      add, remove, close, decBtn, incBtn, amount, dismissModal, trackItem, adjustWeight
    };
  }
});
</script>