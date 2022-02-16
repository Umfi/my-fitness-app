<template>
  <ion-header translucent>
    <ion-toolbar>
      <ion-title>Add Exercise</ion-title>
      <ion-buttons slot="end">
        <ion-button @click="dismissModal">
          <ion-icon slot="icon-only" :icon="close"></ion-icon>
        </ion-button>
      </ion-buttons>
    </ion-toolbar>
  </ion-header>
  <ion-content class="ion-padding">
    
    <ion-item lines="none" fill="outline" :class="submittedOnce && (exercise == '') ? 'ion-invalid' : ''">
        <ion-label position="stacked" color="primary">Exercise</ion-label>
        <ion-input
          v-model="exercise"
          type="text"
          spellcheck="false"
          autocapitalize="on"
          @ionInput="suggest($event.target.value)"
        ></ion-input>
        <ion-note slot="error" color="danger">Invalid value.</ion-note>
    </ion-item>
    
    <ion-card class="suggestions-card" v-if="filteredSuggestions.length">
      <ion-item v-for="suggestion in filteredSuggestions.slice(0, 10)" :key="suggestion.id" @click="selectSuggestion(suggestion.name)">{{ suggestion.name }}</ion-item>
    </ion-card>
   

    <ion-grid>
        <ion-row>
            <ion-col size="6" class="ion-align-self-center">
                <ion-label>
                    <h1>Sets</h1>
                </ion-label>
            </ion-col>
            <ion-col size="6">
                   <ion-button type="button" color="secondary" @click="addSet" expand="full">Add Set</ion-button>
            </ion-col>
        </ion-row>
    </ion-grid>
 
    <ion-list>
      <ion-card v-for="(set, index) in sets" :key="index">
          <ion-card-header>
            <ion-card-title>
              {{ index + 1 }}. Set
              <ion-icon class="ion-float-end" :icon="closeCircleOutline" @click="removeSet(index)"></ion-icon>
            </ion-card-title>
          </ion-card-header>
          <ion-card-content>
            <ion-item :class="submittedOnce && (sets[index].repetitions == '' || isNaN(sets[index].repetitions) || sets[index].repetitions == 0) ? 'ion-invalid' : ''">
                <ion-label>Repetitions</ion-label>
                <ion-input type="number" clearInput="true" v-model="sets[index].repetitions" class="ion-text-center"></ion-input>
                <ion-button slot="end" fill="none"  @click="openRepetitionPicker(index)">
                    <ion-icon slot="icon-only" color="tertiary" :icon="caretUpCircle"></ion-icon>
                </ion-button>
              <ion-note slot="error" color="danger">Invalid value.</ion-note>
            </ion-item>
            <ion-item :class="submittedOnce && (sets[index].weight == '' || isNaN(sets[index].weight)) ? 'ion-invalid' : ''">
                <ion-label>Weight&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</ion-label>
                <ion-input type="number" clearInput="true" v-model="sets[index].weight" class="ion-text-center"></ion-input>
                <ion-button slot="end" fill="none"  @click="openWeightPicker(index)">
                    <ion-icon slot="icon-only" color="tertiary" :icon="caretUpCircle"></ion-icon>
                </ion-button>
                <ion-note slot="error" color="danger">Invalid value.</ion-note>
            </ion-item>
          </ion-card-content>
      </ion-card>
    </ion-list>

  </ion-content>
  <ion-footer>
    <ion-row responsive-sm>
      <ion-col>
        <ion-button type="button" @click="finishExercise" expand="block">Finish Exercise</ion-button>
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
  IonList,
  IonItem,
  modalController,
  loadingController,
  pickerController,
  IonLabel,
  IonIcon,
  IonFooter,
  IonCard,
  IonCardHeader,
  IonCardTitle,
  IonCardContent,
  IonGrid,
  IonInput,
  IonNote
} from "@ionic/vue";
import { defineComponent } from "vue";

import { close, caretUpCircle, closeCircleOutline } from "ionicons/icons";

import { SetModel, getAllExercises, ExerciseModel } from "@/service/WorkoutService";

export default defineComponent({
  name: "ModalAddExercise",
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
    IonItem,
    IonLabel,
    IonIcon,
    IonFooter,
    IonCard,
    IonCardHeader,
    IonCardTitle,
    IonCardContent,
    IonGrid,
    IonInput,
    IonNote
  },
  props: {
    exerciseName: { type: String, default: "" },
    setsData: { type: Object, default: null },
  },
  data() {
    return {
      submittedOnce: false,
      suggestions: [] as Array<ExerciseModel>,
      filteredSuggestions: [] as Array<ExerciseModel>,
      exercise: "",
      sets: [
        {
          repetitions: 0,
          weight: 0
        },
      ] as Array<SetModel>
    };
  },
  async mounted() {
    this.exercise = this.$props.exerciseName;
    this.sets = this.$props.setsData as Array<SetModel>;
    this.suggestions = await getAllExercises();
  },
  setup() {
    return {
      close, caretUpCircle, closeCircleOutline
    };
  },
  methods: {
    async dismissModal() {
      const modal = await modalController.getTop();
      modal.dismiss();
    },
    async showLoading() {
      const loading = await loadingController
        .create({
          message: 'Please wait...',
        });

      await loading.present();
    },
    suggest(input: string) {
      if (input == "") {
        this.filteredSuggestions = [];
      } else {
        this.filteredSuggestions = this.suggestions.filter(function(suggestion) {
            return suggestion.name.toLowerCase().includes(input.toLowerCase());
        });
      }
    },
    selectSuggestion(suggestion: string) {
      this.exercise = suggestion;
      this.filteredSuggestions = [];
    },
    addSet() {
     this.sets.push({
          repetitions: 0,
          weight: 0
        });
    },
    removeSet(index: number) {
      let tmp = this.sets;
      tmp = tmp.slice(0,index).concat(tmp.slice(index+1));
      this.sets = tmp;
    },
    async finishExercise() {
      this.submittedOnce = true;
      this.showLoading();
      const that = this;
      setTimeout(async function() {
        loadingController.dismiss();
        if (document.querySelectorAll(".ion-invalid").length == 0) {
          const modal = await modalController.getTop();
          modal.dismiss({
            "sets" : that.sets,
            "exercise" : that.exercise
          });
        }
      }, 500);
    },
    async openRepetitionPicker(index: number) {
      const picker = await pickerController.create({
        columns: [
            {
                name: "reps",
                options: [
                { text: "1", value: "1" },
                { text: "2", value: "2" },
                { text: "3", value: "3" },
                { text: "4", value: "4" },
                { text: "5", value: "5" },
                { text: "6", value: "6" },
                { text: "7", value: "7" },
                { text: "8", value: "8" },
                { text: "9", value: "9" },
                { text: "10", value: "10" },
                { text: "11", value: "11" },
                { text: "12", value: "12" },
                { text: "13", value: "13" },
                { text: "14", value: "14" },
                { text: "15", value: "15" },
                { text: "16", value: "16" },
                { text: "17", value: "17" },
                { text: "18", value: "18" },
                { text: "19", value: "19" },
                { text: "20", value: "20" },
                ],
            }
       ],
        buttons: [
          {
            text: "Cancel",
            role: "cancel",
          },
          {
            text: "Confirm",
            handler: (value) => {
              this.sets[index].repetitions = value.reps.value;
            },
          },
        ],
      });
      await picker.present();
    },
    async openWeightPicker(index: number) {
      const picker = await pickerController.create({
        columns: [
            {
                name: "weight",
                options: [
                { text: "1.25", value: "1.25" },
                { text: "2.5", value: "2.5" },
                { text: "5", value: "5" },
                { text: "7.5", value: "7.5" },
                { text: "10", value: "10" },
                { text: "12", value: "12" },
                { text: "14", value: "14" },
                { text: "15", value: "15" },
                { text: "16", value: "16" },
                { text: "18", value: "18" },
                { text: "20", value: "20" },
                { text: "25", value: "25" },
                { text: "27.5", value: "27.5" },
                { text: "30", value: "30" },
                { text: "40", value: "40" },
                { text: "50", value: "50" },
                { text: "60", value: "60" },
                { text: "70", value: "70" },
                { text: "80", value: "80" },
                { text: "90", value: "90" },
                { text: "100", value: "100" },
                { text: "110", value: "110" },
                { text: "120", value: "120" },
                { text: "130", value: "130" },
                { text: "140", value: "140" },
                { text: "150", value: "150" },
                ],
            }
       ],
        buttons: [
          {
            text: "Cancel",
            role: "cancel",
          },
          {
            text: "Confirm",
            handler: (value) => {
              this.sets[index].weight = value.weight.value;
            },
          },
        ],
      });
      await picker.present();
    },
  }
});
</script>
<style scoped>
.suggestions-card {
  margin-top: 0;
  position: absolute;
  left: 5px;
  right: 5px;
  z-index: 10;
}
</style>