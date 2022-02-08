<template>
  <ion-header translucent>
    <ion-toolbar>
      <ion-title>Track Workout</ion-title>
      <ion-buttons slot="end">
        <ion-button @click="dismissModal">
          <ion-icon slot="icon-only" :icon="close"></ion-icon>
        </ion-button>
      </ion-buttons>
    </ion-toolbar>
  </ion-header>
  <ion-content fullscreen class="ion-padding">
    <div v-if="!workoutFinished">
      <ion-button type="button" color="secondary" @click="addExercise" expand="full">Add Exercise</ion-button>
      <ion-list v-show="exercises.length > 0">
        <ion-list-header>
          <ion-label>Completed Exercises</ion-label>
        </ion-list-header>
        <ion-item v-for="(exercise, index) in exercises" :key="index" button detail @click="viewExercise(index)">
          <ion-label>{{ exercise.name }}</ion-label>
        </ion-item>
      </ion-list>
    </div>
    <div v-if="workoutFinished">
      <div class="ion-text-center" >
        <ion-text color="primary"><h1 class="ion-no-margin">Summary</h1></ion-text>
        <div class="circle">{{ totalWeight }} kg</div>
      </div>

      <ion-accordion-group>
        <ion-accordion v-for="(exercise, index) in exercises" :key="index">
          <ion-item slot="header">
            <ion-label>{{ exercise.name }}</ion-label>
          </ion-item>
          <ion-list slot="content">
            <ion-item v-for="(set, indexInner) in exercise.sets" :key="indexInner" lines="full" class="ion-text-center">
              <ion-grid>
                <ion-row>
                  <ion-col size="4" class="ion-text-start">
                     <p>{{ indexInner + 1 }}. Set</p>
                  </ion-col>
                  <ion-col size="4">
                    <p><b>{{ set.repetitions }}</b> reps</p>
                  </ion-col>
                  <ion-col size="4">
                    <p><b class="summary-highlight">{{ set.weight }}</b> kg</p>
                  </ion-col>
                </ion-row>
              </ion-grid>
            </ion-item>
          </ion-list>
        </ion-accordion>
      </ion-accordion-group>

      <ion-card v-if="personalRecords.length > 0">
        <ion-card-header>
          <ion-card-title>
            New Personal Records
          </ion-card-title>
        </ion-card-header>
        <ion-card-content>
            <ion-row>
              <ion-col size="4" class="ion-text-center ion-align-self-center">
                <ion-icon color="warning" style="font-size: 25px; font-weight: bold;" :icon="trophy"></ion-icon>
              </ion-col>
              <ion-col class="ion-text-end ion-align-self-center">
                     <ion-row v-for="record in personalRecords" :key="record.id">{{ record.description}}: {{ record.value }} kg </ion-row>
              </ion-col>
            </ion-row>
        </ion-card-content>
      </ion-card>

    </div>
  </ion-content>
  <ion-footer>
    <ion-row responsive-sm>
      <ion-col>
        <ion-button type="button" v-if="!workoutFinished" @click="trackWorkout" expand="block">Finish Workout</ion-button>
        <ion-button type="button" v-if="workoutFinished" @click="dismissModal" expand="block">Close</ion-button>
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
  IonList,
  IonListHeader,
  IonItem,
  modalController,
  toastController,
  loadingController,
  alertController,
  IonLabel,
  IonIcon,
  IonFooter,
  IonText,
  IonAccordion,
  IonAccordionGroup,
  IonGrid,
  IonCard,
  IonCardHeader,
  IonCardTitle,
  IonCardContent
} from "@ionic/vue";
import { defineComponent } from "vue";

import { getAllAdvancedWorkoutsFromDay, storeAdvancedWorkout } from "@/service/WorkoutService.js";
import { close, trophy } from "ionicons/icons";

import ModalAddExercise from "./ModalAddExercise.vue";


export default defineComponent({
  name: "ModalDetailedWorkout",
  props: {
    item: { type: Object, default: null },
    title: { type: String },
    parent: { type: Object, default: null },
  },
  data() {
    return {
      exercises: [],
      personalRecords: [],
      workoutFinished: false
    };
  },
  computed: {
    totalWeight: function () {
      let total = 0;
      for (var i = 0; i < this.exercises.length; i++) {
        for (var j = 0; j < this.exercises[i].sets.length; j++) {
          total += (this.exercises[i].sets[j].repetitions * this.exercises[i].sets[j].weight);
        }
      }
      return total
    }
  },
  async mounted() {
    await this.showLoading();
    var that = this;
    getAllAdvancedWorkoutsFromDay(this.$props.item.date).then(result => {

      var tmp = {};
      for (var j = 0; j < result.length; j++) {
        tmp[result[j].name] = [];
      }

      for (var i = 0; i < result.length; i++) {
        tmp[result[i].name].push({
              repetitions: result[i].repetitions,
              weight: result[i].weight
        })
      }

      for (var prop in tmp) {
        that.exercises.push({
            name: prop,
            sets: tmp[prop]
        })
      }

      if (that.exercises.length > 0) {
        that.workoutFinished = true;
      }

      loadingController.dismiss()
    }); 
  },
  setup() {
    return {
      close, trophy
    };
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
    async showLoading() {
      const loading = await loadingController
        .create({
          message: 'Please wait...',
        });

      await loading.present();
    },
    async addExercise() {
      const modal = await modalController
        .create({
          component: ModalAddExercise,
          componentProps: {
          exerciseName: "",
          setsData: [{
            repetitions: "",
            weight: ""
          }]
          },
        })

        modal.onDidDismiss().then((data) => {
          if (data['data'] != undefined) {
              this.exercises.push({
                name: data['data'].exercise,
                sets: data['data'].sets
              })
          }
        });

        return modal.present();
    },
    async viewExercise(index) {
      const modal = await modalController.create({
        component: ModalAddExercise,
        componentProps: {
          exerciseName: this.exercises[index].name,
          setsData: this.exercises[index].sets
        },
      });
      return modal.present();
    },
    async trackWorkout() {

      if (this.exercises.length == 0) {
        this.showToast("To track a workout you need to add the exercises that you have done.");
        return;
      }
      
      const alert = await alertController
        .create({
          header: 'Finish workout?',
          message: 'Are you really done with your workout?',
          buttons: [
            {
              text: 'No',
              role: 'cancel',
              cssClass: 'secondary',
            },
            {
              text: 'Yes',
              id: 'confirm-button',
              handler: () => {
                this.trackWorkoutAction();
              },
            },
          ],
        });
      return alert.present();
    },
    async trackWorkoutAction() { 
        var item = this.$props.item;

        const newEvent = await storeAdvancedWorkout({
            date: item.date,
            exercises: this.exercises
        });
        
        if (newEvent != null) {
          this.$props.parent.doRefresh(false);
          this.showToast("Workout tracked.");
          this.personalRecords = newEvent.new_personal_records;
          this.workoutFinished = true;
        } else {
          this.showToast("Couldn't track workout.");
        }
    },
  },
  components: {
    IonContent,
    IonHeader,
    IonTitle,
    IonToolbar,
    IonButton,
    IonButtons,
    IonRow,
    IonCol,
    IonList,
    IonListHeader,
    IonItem,
    IonLabel,
    IonIcon,
    IonFooter,
    IonText,
    IonAccordion,
    IonAccordionGroup,
    IonGrid,
    IonCard,
    IonCardHeader,
    IonCardTitle,
    IonCardContent
  },
});
</script>
<style scoped>
 .summary-highlight {
   color: var(--ion-color-primary, #3880ff) !important;
 }

 .circle {
    margin-top: 10px;
    border-radius: 50%;
    -moz-border-radius: 50%;
    -webkit-border-radius: 50%;
    color: #6e6e6e;
    display: inline-block;
    font-weight: bold;
    line-height: 109px;
    margin-right: 5px;
    text-align: center;
    width: 140px;
    font-size: 21px;
    border: 3px solid var(--ion-color-primary, #3880ff);
 }
</style>