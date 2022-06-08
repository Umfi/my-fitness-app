<template>
 <ion-card v-show="!loadingCard" ref="card">
        <ion-card-header>
          <ion-card-title class="ion-align-self-center">
            Personal Records
          </ion-card-title>
        </ion-card-header>
        <ion-card-content>
          <ion-grid>
            <ion-row>
              <ion-col>Exercise</ion-col>
              <ion-col class="ion-text-end">Weight</ion-col>
            </ion-row>
            <ion-row v-for="record in personalRecords" v-bind:key="record.id">
              <ion-col>{{ record.description}}</ion-col>
              <ion-col class="ion-text-end"><b>{{ record.value }}</b> kg</ion-col>
            </ion-row>
            <ion-row v-if="personalRecords.length == 0">No records set yet</ion-row>
          </ion-grid>
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
  IonGrid,
  IonCol,
  IonRow,
  IonCard,
  IonCardHeader,
  IonCardContent,
  IonCardTitle,
  IonSkeletonText,
  IonThumbnail
} from "@ionic/vue";

import { createGesture } from '@ionic/vue';


import { getPersonalRecords, PersonalRecordModel } from "@/service/StatsService";

export default defineComponent({
  name: "PersonalRecordCard",
  emits: ["pushed"],
  components: {
    IonGrid,
    IonCol,
    IonRow,
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
         card, personalRecords, loadingCard, reload
     }
  }
})
</script>
<style scoped>

ion-grid {
  --ion-grid-column-padding: 10px;
  border-collapse: collapse;
  border-style: hidden;
}

ion-row:first-child {
  font-weight: bold;
  border-bottom: 1px solid #e0e0e0;
}



</style>