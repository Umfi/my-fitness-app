<template>
    <ion-card v-bind:color="bmi_style" v-show="!loadingCard" ref="card">
        <ion-card-header>
            <ion-card-title>
            BMI
            </ion-card-title>
        </ion-card-header>
        <ion-card-content>
            <ion-row>
                <ion-col>
                <ion-label v-text="bmi_value" style="font-size: 25px; font-weight: bold;"></ion-label>
                </ion-col>
                <ion-col class="ion-text-end ion-align-self-center">
                    <ion-icon v-if="bmi_icon == 'sad'" style="font-size: 25px; font-weight: bold;" :icon="sadOutline"></ion-icon>
                    <ion-icon v-if="bmi_icon == 'happy'" style="font-size: 25px; font-weight: bold;" :icon="happyOutline"></ion-icon>
                </ion-col>
                <ion-col class="ion-align-self-center">
                <ion-label v-text="bmi_text"></ion-label>
                </ion-col>
            </ion-row>
        </ion-card-content>
    </ion-card>

    <ion-card v-if="loadingCard">
    <ion-card-header>
        <ion-card-title>
        <ion-skeleton-text animated style="width: 60%"></ion-skeleton-text>
        </ion-card-title>
    </ion-card-header>
    <ion-card-content>
        <ion-thumbnail style="width: 100%;">
        <ion-skeleton-text animated></ion-skeleton-text>
        </ion-thumbnail>
    </ion-card-content>
    </ion-card>
</template>

<script lang="ts">
import { defineComponent, onMounted, ref } from "vue";
import {
  IonLabel,
  IonCol,
  IonRow,
  IonIcon,
  IonCard,
  IonCardHeader,
  IonCardContent,
  IonCardTitle,
  IonSkeletonText,
  IonThumbnail
} from "@ionic/vue";

import { createGesture } from '@ionic/vue';

import { sadOutline, happyOutline } from "ionicons/icons";

import { getUserData } from "@/service/UserService";

export default defineComponent({
  name: "BmiCard",
  emits: ["pushed"],
  components: {
    IonLabel,
    IonCol,
    IonRow,
    IonIcon,
    IonCard,
    IonCardHeader,
    IonCardContent,
    IonCardTitle,
    IonSkeletonText,
    IonThumbnail
  },
  setup(_, context) {
    const card = ref();

    let bmi_text = ref("");
    let bmi_icon = ref("happy");
    let bmi_value = ref(0);
    let bmi_style = ref("success");
    let loadingCard = ref(true);


   async function calculateBMI() {
        
        const userData = await getUserData();

        if (userData != null) {
          var weight = userData.details.weight;
          var height = userData.details.height;
          var bmi = weight / (height * height) * 10000;
          bmi = Math.round( bmi * 1e2 ) / 1e2

          bmi_value.value = bmi;

          if (bmi < 18.5) {
            bmi_style.value = "warning";
            bmi_icon.value = "sad";
            bmi_text.value = "underweight";
          } else if (bmi >= 18.5 && bmi < 25) {
            bmi_style.value = "success";
            bmi_icon.value = "happy";
            bmi_text.value = "normal weight";
          } else if (bmi >= 25 && bmi < 30) {
            bmi_style.value = "warning";
            bmi_icon.value = "sad";
            bmi_text.value = "slight overweight";
          } else if (bmi >= 30 && bmi < 35) {
            bmi_style.value = "danger";
            bmi_icon.value = "sad";
            bmi_text.value = "overweight";
          } else if (bmi >= 35 && bmi < 40) {
            bmi_style.value = "danger";
            bmi_icon.value = "sad";
            bmi_text.value = "strong overweight";
          } else {
            bmi_style.value = "danger";
            bmi_icon.value = "sad";
            bmi_text.value = "very strong overweight";
          }

          loadingCard.value = false;
       }
    }

    function reload() {
      loadingCard.value = true;
      calculateBMI();
    }


    let longPressActive = false;
    let timer: number | undefined;
    function gestureStart() {
      longPressActive = true;
      timer = setTimeout(function () {
          if (longPressActive === true) {
             context.emit("pushed");
             longPressActive = false;
          }
      }, 600);
    }
    function gestureMove() {
      longPressActive = false;
    }
    function gestureEnd() {
      longPressActive = false;
      if (timer) {
        clearInterval(timer);
        timer = undefined;
      }
    }

    
    onMounted(async () => {
      await calculateBMI();

      const gesture = createGesture({
        gestureName: 'card-longpress',
        el: card.value.$el,
        threshold: 0,
          onStart: () => { gestureStart() },
          onMove: () => { gestureMove() },
          onEnd: () => { gestureEnd() }
      });
      gesture.enable(true);
     });

     return {
         card, sadOutline, happyOutline, bmi_text, bmi_value, bmi_style, bmi_icon, loadingCard, reload
     }
  }
})
</script>