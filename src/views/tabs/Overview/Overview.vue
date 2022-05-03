<template>
  <ion-page>
    <ion-header :translucent="true">
      <ion-toolbar>
        <ion-buttons slot="start">
          <ion-menu-button></ion-menu-button>
        </ion-buttons>
        <ion-title>My Fitness App</ion-title>
      </ion-toolbar>
    </ion-header>
    <ion-content v-show="renderContent">
      <ion-refresher slot="fixed" @ionRefresh="doRefresh($event)">
        <ion-refresher-content> </ion-refresher-content>
      </ion-refresher>

      <calories-card ref="card1" v-if="isCardVisible(1)" @pushed="showCardActionMenu(1, 'Calories Overview Card')"></calories-card>

      <water-consumption-card ref="card2" v-if="isCardVisible(2)" @pushed="showCardActionMenu(2, 'Water Consumption Card')"></water-consumption-card>
     
      <bmi-card ref="card3" v-if="isCardVisible(3)" @pushed="showCardActionMenu(3, 'BMI Card')"></bmi-card>
     
      <workout-card ref="card4" v-if="isCardVisible(4)" @pushed="showCardActionMenu(4, 'Workout Summary Card')"></workout-card>
   
      <weight-card ref="card5" v-if="isCardVisible(5)" @pushed="showCardActionMenu(5, 'Weight Summary Card')"></weight-card>

      <personal-record-card ref="card6" v-if="isCardVisible(6)" @pushed="showCardActionMenu(6, 'Personal Records Card')"></personal-record-card>
     
      <ion-fab vertical="bottom" horizontal="end" slot="fixed">
        <ion-fab-button>
          <ion-icon :icon="add"></ion-icon>
        </ion-fab-button>
        <ion-fab-list side="top">
          <ion-fab-button @click="trackRecord" v-if="isCardVisible(6)">
            <ion-icon :icon="trophy"></ion-icon>
          </ion-fab-button>
          <ion-fab-button @click="trackWeight">
            <ion-icon :icon="scale"></ion-icon>
          </ion-fab-button>
          <ion-fab-button @click="trackWorkout">
             <ion-icon :icon="barbell"></ion-icon>
          </ion-fab-button>
          <ion-fab-button @click="trackWater" v-if="isCardVisible(2)">
            <ion-icon :icon="water"></ion-icon>
           </ion-fab-button>
        </ion-fab-list>
      </ion-fab>
    </ion-content>
  </ion-page>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import {
  IonContent,
  IonHeader,
  IonPage,
  IonTitle,
  IonToolbar,
  IonButtons,
  IonMenuButton,
  IonRefresher,
  IonRefresherContent,
  IonFab,
  IonFabList,
  IonFabButton,
  IonIcon,
  modalController,
  actionSheetController,
  RefresherCustomEvent
} from "@ionic/vue";


import { add, scale, barbell, water, sadOutline, happyOutline, eyeOff, close, arrowBack, arrowForward, trophy } from "ionicons/icons";

import { trackWaterConsumption, getUserData, updateUserSetting } from "@/service/UserService";

import ModalTrackWeight from "./ModalTrackWeight.vue";
import ModalManageWorkout from "../Workouts/ModalManageWorkout.vue";
import ModalDetailedWorkout from "../Workouts/ModalDetailedWorkout.vue";
import ModalTrackRecord from "./ModalTrackRecord.vue";

import { showToast } from "@/utils";

import CaloriesCard from "@/components/Overview/CaloriesCard.vue";
import WaterConsumptionCard from "@/components/Overview/WaterConsumptionCard.vue";
import BmiCard from "@/components/Overview/BmiCard.vue";
import WorkoutCard from "@/components/Overview/WorkoutCard.vue";
import WeightCard from "@/components/Overview/WeightCard.vue";
import PersonalRecordCard from "@/components/Overview/PersonalRecordCard.vue";
import { isAdvancedTrainignsModeEnabled } from "@/service/WorkoutService";

export default defineComponent({
  name: "Overview",
  components: {
    IonContent,
    IonHeader,
    IonPage,
    IonTitle,
    IonToolbar,
    IonButtons,
    IonMenuButton,
    IonRefresher,
    IonRefresherContent,
    IonFab,
    IonFabList,
    IonFabButton,
    IonIcon,
    CaloriesCard,
    WaterConsumptionCard,
    BmiCard,
    WorkoutCard,
    WeightCard,
    PersonalRecordCard
  },
  setup() {
    return {
      add, scale, barbell, water, sadOutline, happyOutline, eyeOff, close, arrowForward, arrowBack, trophy
    };
  },
  data() {
    return {
      renderContent: false,
      settings: null as any,
      ///
      currentWorkoutDate: new Date(),
      ///
      currentWeightDate: new Date(),
    };
  },
  ionViewDidEnter() {
    this.renderContent = true;
  },
  ionViewWillLeave() {
    this.renderContent = false;
  },
  ionViewWillEnter() {
    this.doRefresh();
  },
  methods: 
  {
    async doRefresh(event?: RefresherCustomEvent) {

        const userData = await getUserData();
        if (userData != null && userData.details != null) {
            this.settings = JSON.parse(userData.details.settings);
        }
        
        const current = new Date();
        this.currentWorkoutDate = new Date();
        this.currentWeightDate = new Date();

        if (this.$refs.card1)
          (this.$refs.card1 as InstanceType<typeof CaloriesCard>).reload();

        if (this.$refs.card2)
          (this.$refs.card2 as InstanceType<typeof WaterConsumptionCard>).reload();

        if (this.$refs.card3)
          (this.$refs.card3 as InstanceType<typeof BmiCard>).reload();

        if (this.$refs.card4)
          (this.$refs.card4 as InstanceType<typeof WorkoutCard>).reload(current.getMonth() + 1, current.getFullYear());

        if (this.$refs.card5)
          (this.$refs.card5 as InstanceType<typeof WeightCard>).reload(current.getMonth() + 1, current.getFullYear());

        if (this.$refs.card6)
          (this.$refs.card6 as InstanceType<typeof PersonalRecordCard>).reload();

        window.dispatchEvent(new Event('resize'));
        
        if (event) 
          event.target.complete();     
    },
    async trackWeight() {

      const modal = await modalController
        .create({
          component: ModalTrackWeight,
           componentProps: {
            parent: this
          },
        })
      return modal.present();
    },
    async trackWorkout() {

      var today = new Date();
      
      let selectedModal: unknown;
      
      const isAdvancedModeEnabled = await isAdvancedTrainignsModeEnabled();
      if (isAdvancedModeEnabled) {
        selectedModal = ModalDetailedWorkout;
      } else {
        selectedModal = ModalManageWorkout;
      }

      const modal = await modalController
        .create({
          component: selectedModal as HTMLElement,
           componentProps: {
            item: {
              date: today,
            },
            title: "Track workout",
            parent: this,
          },
        })
      return modal.present();
    },
    async trackWater() {
 
      var tracked = await trackWaterConsumption({
        ml: 250, // one glass
      });

      if (tracked) {
        
        if (this.$refs.card2)
          (this.$refs.card2 as InstanceType<typeof WaterConsumptionCard>).reload();

        showToast("Glass of water tracked.");
      } else {
        showToast("Couldn't track water consumption.");
      }

    },
    async trackRecord() {

      const modal = await modalController
        .create({
          component: ModalTrackRecord,
           componentProps: {
            parent: this
          },
        })
      return modal.present();
    },
    async showCardActionMenu(cardID: number, cardTitle: string) {
     
      var actions = [
        {
          text: 'Hide',
          role: 'destructive',
          icon: eyeOff,
          handler: async () => {
            
            var data = { 
                "key": "showCard" + cardID, 
                "value": "false" 
            };
            const result = await updateUserSetting(data);
        
            if (!result) {
                showToast("Something went wrong. Couldn't hide card.")
            } else {
              this.doRefresh();
              showToast("You can show this card again. Just enable it in the settings.");
            }
          },
        },
        {
          text: 'Previous month data',
          icon: arrowBack,
          role: 'previous',
          handler: async () => {
            if (cardID == 4) {
              this.currentWorkoutDate.setMonth(this.currentWorkoutDate.getMonth()-1);
              if (this.$refs.card4)
                (this.$refs.card4 as InstanceType<typeof WorkoutCard>).reload(this.currentWorkoutDate.getMonth()+1, this.currentWorkoutDate.getFullYear());
            } else if (cardID == 5) {
              this.currentWeightDate.setMonth(this.currentWeightDate.getMonth()-1);
              if (this.$refs.card5)
                (this.$refs.card5 as InstanceType<typeof WeightCard>).reload(this.currentWeightDate.getMonth()+1, this.currentWeightDate.getFullYear());
             }
          },
        },
        {
          text: 'Next month data',
          icon: arrowForward,
          role: 'next',
          handler: async () => {
            if (cardID == 4) {
              this.currentWorkoutDate.setMonth(this.currentWorkoutDate.getMonth()+1);
              if (this.$refs.card4)
                (this.$refs.card4 as InstanceType<typeof WorkoutCard>).reload(this.currentWorkoutDate.getMonth()+1, this.currentWorkoutDate.getFullYear());
            } else if (cardID == 5) {
              this.currentWeightDate.setMonth(this.currentWeightDate.getMonth()+1);
              if (this.$refs.card5)
                (this.$refs.card5 as InstanceType<typeof WeightCard>).reload(this.currentWeightDate.getMonth()+1, this.currentWeightDate.getFullYear());
            }
          },
        },
        {
          text: 'Cancel',
          icon: close,
          role: 'cancel'
        },
      ];

      if (cardID < 4 || cardID == 6) {
          actions.splice(1, 2);
      }

      const actionSheet = await actionSheetController
        .create({
          header: cardTitle,
          buttons: actions
        });
      await actionSheet.present();
    },
    isCardVisible(cardID: number) {
      if (this.settings != null) {
          if ("showCard" + cardID in this.settings) {
              var returnVal = this.settings["showCard" + cardID];
              if (returnVal === true) {
                  return true;
              } else {
                  return false;
              }
          }
      }
      return true;
    }
  }
})
</script>