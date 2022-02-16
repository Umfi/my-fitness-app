<template>
  <ion-page>
    <ion-tabs>
      <ion-router-outlet></ion-router-outlet>
      <ion-tab-bar slot="bottom">
        <ion-tab-button tab="calories" href="/tabs/calories">
          <ion-icon :icon="restaurant"></ion-icon>
          <ion-label>Calories</ion-label>
        </ion-tab-button>

        <ion-tab-button tab="overview" href="/tabs/overview">
          <ion-icon :icon="man"></ion-icon>
          <ion-label>Overview</ion-label>
        </ion-tab-button>

        <ion-tab-button tab="workouts" href="/tabs/workouts">
          <ion-icon :icon="barbell"></ion-icon>
          <ion-label>Workouts</ion-label>
        </ion-tab-button>
      </ion-tab-bar>
    </ion-tabs>
  </ion-page>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { 
  IonIcon, 
  IonLabel, 
  IonPage,
  IonTabBar, 
  IonTabButton, 
  IonTabs,
  IonRouterOutlet
} from '@ionic/vue';
import { restaurant, man, barbell } from 'ionicons/icons';

export default defineComponent({
  name: "Home",
  components: { IonIcon, IonLabel, IonPage, IonTabBar, IonTabButton, IonTabs, IonRouterOutlet },
  setup() {
    return {
      restaurant,
      man,
      barbell
    }
  }
});
</script>