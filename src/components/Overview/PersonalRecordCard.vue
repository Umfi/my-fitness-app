<template>
 <ion-card v-show="!loadingCard" ref="card">
        <ion-card-header>
          <ion-card-title>
            Personal Records
          </ion-card-title>
        </ion-card-header>
        <ion-card-content>
            <ion-row>
              <ion-col size="2" class="ion-text-center ion-align-self-center">
                <ion-icon color="warning" style="font-size: 25px; font-weight: bold;" :icon="trophy"></ion-icon>
              </ion-col>
              <ion-col class="ion-text-end ion-align-self-center">
                     <ion-row v-for="record in personalRecords" v-bind:key="record.id">{{ record.description}}: {{ record.value }} kg </ion-row>
                     <ion-row v-if="personalRecords.length == 0">No records set yet</ion-row>
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

import { trophy } from "ionicons/icons";

import { getPersonalRecords, PersonalRecordModel } from "@/service/StatsService";

export default defineComponent({
  name: "PersonalRecordCard",
  emits: ["pushed"],
  components: {
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

    let personalRecords = ref<Array<PersonalRecordModel>>([]);
    let loadingCard = ref(true);

    async function loadPersonalRecords() {
      const data = await getPersonalRecords();
  
      if (data != null) {
        personalRecords.value = data;
        loadingCard.value = false;
        return true;
      }

      return false;
    }

    function reload() {
      loadingCard.value = true;
      loadPersonalRecords();
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
      await loadPersonalRecords();

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
         card, trophy, personalRecords, loadingCard, reload
     }
  }
})
</script>