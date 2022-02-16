<template>
  <ion-page>
    <ion-header :translucent="true">
      <ion-toolbar>
        <ion-title>My Fitness App</ion-title>
      </ion-toolbar>
    </ion-header>

    <ion-content :fullscreen="true">
      <ion-card>
        <ion-card-header>
          <ion-card-title>Reset password</ion-card-title>
        </ion-card-header>
        <ion-card-content>
          <form novalidate @submit.prevent="resetPassword">
            <ion-list>
              <ion-item>
                <ion-label position="stacked" color="primary">E-Mail</ion-label>
                <ion-input
                  v-model="email"
                  name="email"
                  type="email"
                  spellcheck="false"
                  autocapitalize="off"
                  required
                ></ion-input>
              </ion-item>

              <ion-text color="danger">
               <p v-show="!emailValid()" v-text="errorEmail" padding-left></p>
              </ion-text>
            </ion-list>

            <ion-row responsive-sm>
              <ion-col>
                <ion-button
                  :disabled="sendDisabled"
                  type="submit"
                  expand="block">
                  Send Reset E-Mail
                  </ion-button>
              </ion-col>
            </ion-row>

            <ion-row responsive-sm>
              <ion-col size="12" class="ion-text-center">
                <ion-label
                  ><a href="/login">Back to Login?</a></ion-label>
              </ion-col>
            </ion-row>
          </form>
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
  IonText,
  IonButton,
  IonCol,
  IonRow
} from "@ionic/vue";
import { defineComponent } from "vue";

import { forgotPassword } from "@/service/AuthService";
import { showToast } from "@/utils";


export default defineComponent({
  name: "ForgotPassword",
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
    IonText,
    IonButton,
    IonCol,
    IonRow,
  },
  data() {
    return {
      email: "",
      errorEmail: "",
      onceSubmitted: false,
      sendDisabled: false
    };
  },
  methods: {
    emailValid() {
      var re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

      if (this.email == null || this.email == "") {
        if (this.onceSubmitted) {
          this.errorEmail = "E-Mail is required";
          return false;
        }
      } else if (!re.test(this.email)) {
        this.errorEmail = "Please enter a valid E-Mail";
        return false;
      }

      this.errorEmail = "";
      return true;
    },
    async resetPassword() {
      let email = this.email;

      this.onceSubmitted = true;
      if (!this.emailValid()) {
        return;
      }

      this.sendDisabled = true;
      const resetSuccess = await forgotPassword({ 
        email: email 
      });
      this.sendDisabled = false;

      if (resetSuccess) {
          this.$router.push("/resetPassword?email=" + encodeURIComponent(this.email));
      } else {
          showToast("Couldn't sent password reset email!");
      }
    },
  },
});
</script>