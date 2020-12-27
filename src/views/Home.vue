<template>
  <ion-page>
    <ion-tabs>
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

<script>
import { defineComponent } from 'vue';
import { 
  IonIcon, 
  IonLabel, 
  IonPage,
  IonTabBar, 
  IonTabButton, 
  IonTabs
} from '@ionic/vue';
import { restaurant, man, barbell } from 'ionicons/icons';

export default defineComponent({
  name: "Home",
  components: { IonIcon, IonLabel, IonPage, IonTabBar, IonTabButton, IonTabs },
  setup() {
    return {
      restaurant,
      man,
      barbell
    }
  }
});
</script>

<style scoped>
#container {
  text-align: center;
  
  position: absolute;
  left: 0;
  right: 0;
  top: 50%;
  transform: translateY(-50%);
}

#container strong {
  font-size: 20px;
  line-height: 26px;
}

#container p {
  font-size: 16px;
  line-height: 22px;
  
  color: #8c8c8c;
  
  margin: 0;
}

#container a {
  text-decoration: none;
}
</style>