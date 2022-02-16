<template>
  <ion-page>
    <ion-header :translucent="true">
      <ion-toolbar>
        <ion-buttons slot="start">
          <ion-back-button></ion-back-button>
        </ion-buttons>

        <ion-title>Profile</ion-title>
      </ion-toolbar>
    </ion-header>

    <ion-content :fullscreen="true">
      <ion-card v-if="loaded">
        <ion-card-header>
          <ion-card-title>Profile</ion-card-title>
        </ion-card-header>
        <ion-card-content>
          <form novalidate @submit.prevent="updateProfile">
            <ion-list>
              <ion-item>
                <ion-label position="stacked" color="primary">Gender</ion-label>
                <ion-select
                  v-model="gender"
                  name="gender"
                  placeholder="Select One"
                  required
                >
                  <ion-select-option value="1">Female</ion-select-option>
                  <ion-select-option value="0">Male</ion-select-option>
                </ion-select>
              </ion-item>

              <ion-item>
                <ion-label position="stacked" color="primary"
                  >Birthday</ion-label
                >
                <ion-datetime
                  v-model="dob"
                  name="dob"
                  presentation="date"
                  required
                ></ion-datetime>
              </ion-item>

              <ion-item>
                <ion-label position="stacked" color="primary"
                  >Weight (in kg)</ion-label
                >
                <ion-input
                  v-model="weight"
                  name="weight"
                  type="number"
                  required
                ></ion-input>
              </ion-item>

              <ion-item>
                <ion-label position="stacked" color="primary"
                  >Height (in cm)</ion-label
                >
                <ion-input
                  v-model="height"
                  name="height"
                  type="number"
                  required
                ></ion-input>
              </ion-item>

              <ion-item>
                <ion-label position="stacked" color="primary"
                  >Activity level</ion-label
                >
                <ion-select
                  v-model="activity"
                  name="activity"
                  placeholder="Select One"
                  required
                >
                  <ion-select-option value="0">little active</ion-select-option>
                  <ion-select-option value="1" >slightly active</ion-select-option>
                  <ion-select-option value="2">moderately active</ion-select-option>
                  <ion-select-option value="3">very active</ion-select-option>
                  <ion-select-option value="4">extremely active</ion-select-option>
                </ion-select>
              </ion-item>

              <ion-item>
                <ion-label position="stacked" color="primary">Goal</ion-label>
                <ion-select
                  v-model="goal"
                  name="goal"
                  placeholder="Select One"
                  required
                >
                  <ion-select-option value="0">Fat loss</ion-select-option>
                  <ion-select-option value="1">Muscle building</ion-select-option>
                  <ion-select-option value="2">Keep weight</ion-select-option>
                </ion-select>
              </ion-item>
            </ion-list>

            <ion-row responsive-sm>
              <ion-col>
                <ion-button type="submit" expand="block"
                  >Update calories requirement</ion-button
                >
              </ion-col>
            </ion-row>
          </form>

          <ion-item-divider>
            <ion-label>
              Danger Zone
            </ion-label>
          </ion-item-divider>

          <ion-row responsive-sm>
            <ion-col>
              <ion-button color="danger" expand="block" @click="presentAlertDeleteAccount()">Delete Account</ion-button>
            </ion-col>
          </ion-row>

        </ion-card-content>
      </ion-card>
    </ion-content>
  </ion-page>
</template>

<script lang="ts">
import {
  IonContent,
  IonHeader,
  IonPage,
  IonTitle,
  IonToolbar,
  IonCard,
  IonCardHeader,
  IonCardContent,
  IonCardTitle,
  IonLabel,
  IonInput,
  IonItem,
  IonList,
  IonButton,
  IonButtons,
  IonBackButton,
  IonCol,
  IonRow,
  IonSelect,
  IonSelectOption,
  IonDatetime,
  IonItemDivider,
  loadingController,
  alertController,
} from "@ionic/vue";
import { defineComponent } from "vue";

import { updateUserData, getUserData, deleteAccount } from "@/service/UserService";
import { showToast } from "@/utils";

export default defineComponent({
  name: "Profile",
  components: {
    IonContent,
    IonHeader,
    IonPage,
    IonTitle,
    IonToolbar,
    IonCard,
    IonCardHeader,
    IonCardContent,
    IonCardTitle,
    IonLabel,
    IonInput,
    IonItem,
    IonList,
    IonButton,
    IonButtons,
    IonBackButton,
    IonCol,
    IonRow,
    IonSelect,
    IonSelectOption,
    IonDatetime,
    IonItemDivider
  },
  data() {
    return {
      loaded: false,
      gender: null as string | null,
      dob: null as string | null,
      weight: null as number | null,
      height: null as number | null,
      activity: null as string | null,
      goal: null as string | null,
    };
  },
  async created() {
    await this.showLoading();
    const userData = await getUserData();

    if (userData != null) {
      this.gender = userData.details.gender.toString();
      this.dob = userData.details.birthday.substring(0,10);
      this.weight = userData.details.weight;
      this.height = userData.details.height;
      this.activity = userData.details.activity.toString();
      this.goal = userData.details.goal.toString();
    }

    loadingController.dismiss();
    this.loaded = true;
  },
  methods: {
    async showLoading() {
      const loading = await loadingController.create({
        message: "Please wait...",
      });

      await loading.present();
    },
    async presentAlertDeleteAccount() {
      const alert = await alertController
        .create({
          header: 'Delete Account?',
          message: "Do you really want to delete your account? This can't be undone.",
          buttons: [
            {
              text: 'No',
              role: 'cancel',
              cssClass: 'secondary',
            },
            {
              text: 'Yes, delete Account!',
              handler: async () => {
                
                const deleted = await deleteAccount();

                if (deleted) {
                  this.$router.push("/login");
                  showToast("Account has been deleted!");
                } else {
                  showToast("Couldn't delete account.");
                }
              },
            },
          ],
        });
      return alert.present();
    },
    async updateProfile() {
      if (this.gender !== null && this.dob != null && this.weight != null && this.height != null && this.activity != null && this.goal != null) {
        await this.showLoading();

        let updateSuccessful = await updateUserData({
          gender: parseInt(this.gender),
          dob: this.dob,
          weight: this.weight,
          height: this.height,
          activity: parseInt(this.activity),
          goal: parseInt(this.goal),
          language: "en",
        });

        loadingController.dismiss();
        if (updateSuccessful) {
          showToast("Update succesful!");
        } else {
          showToast("Update failed!");
        }
      } else {
          showToast("Update failed!");
      } 
    },
  },
});
</script>
