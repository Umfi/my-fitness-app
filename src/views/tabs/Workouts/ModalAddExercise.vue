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
  <ion-content class="ion-padding exercise-content">
    
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
   
    <ion-list>
      <ion-list-header lines="inset">
        <ion-label><h1>Sets</h1></ion-label>
      </ion-list-header>
      <ion-card v-for="(set, index) in sets" :key="index">
          <ion-card-header>
            <ion-card-title>
              {{ index + 1 }}. Set
              <ion-icon class="ion-float-end" color="danger" :icon="closeCircleOutline" @click="removeSet(index)"></ion-icon>
            </ion-card-title>
          </ion-card-header>
          <ion-card-content>
            <ion-item :class="submittedOnce && (sets[index].repetitions == '' || isNaN(sets[index].repetitions) || sets[index].repetitions == 0) ? 'ion-invalid' : ''">
                <ion-label>Repetitions</ion-label>
                <ion-input type="number" @ionFocus="onFocus($event)"  v-model="sets[index].repetitions" class="ion-text-center"></ion-input>
              <ion-note slot="error" color="danger">Invalid value.</ion-note>
            </ion-item>
            <ion-item :class="submittedOnce && (sets[index].weight == '' || isNaN(sets[index].weight)) ? 'ion-invalid' : ''">
                <ion-label>Weight&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</ion-label>
                <ion-input type="number" @ionFocus="onFocus($event)" v-model="sets[index].weight" class="ion-text-center"></ion-input>
                <ion-note slot="error" color="danger">Invalid value.</ion-note>
            </ion-item>
          </ion-card-content>
      </ion-card>
    </ion-list>

    <ion-fab vertical="bottom" horizontal="end" slot="fixed">
      <ion-fab-button color="secondary" @click="addSet">
        <ion-icon :icon="add"></ion-icon>
      </ion-fab-button>
    </ion-fab>
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
  IonList,
  IonItem,
  modalController,
  loadingController,
  IonLabel,
  IonIcon,
  IonFooter,
  IonCard,
  IonCardHeader,
  IonCardTitle,
  IonCardContent,
  IonInput,
  IonNote,
  IonRow,
  IonCol,
  IonListHeader,
  IonFab,
  IonFabButton,
  InputCustomEvent,
} from "@ionic/vue";
import { defineComponent } from "vue";

import { close, closeCircleOutline, add } from "ionicons/icons";

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
    IonList,
    IonItem,
    IonLabel,
    IonIcon,
    IonFooter,
    IonCard,
    IonCardHeader,
    IonCardTitle,
    IonCardContent,
    IonInput,
    IonNote,
    IonRow,
    IonCol,
    IonListHeader,
    IonFab,
    IonFabButton
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
      close, closeCircleOutline, add
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
    onFocus(event: InputCustomEvent) {
      event.target.getInputElement().then((input: HTMLInputElement) => {
        input.select();
      });
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
     let reps = this.sets.length > 0 ? this.sets[this.sets.length-1].repetitions : 0;
     let weight = this.sets.length > 0 ? this.sets[this.sets.length-1].weight : 0;

     this.sets.push({
          repetitions: reps,
          weight: weight
      });

    setTimeout(function() {
        let ionContentElement : any;
        ionContentElement = document.querySelector('.exercise-content');
        ionContentElement.scrollToBottom(500);
     }, 250);
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
    }
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