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
                  disabled
                ></ion-input>
              </ion-item>

              <ion-item>
                <ion-label position="stacked" color="primary">Password</ion-label>
                <ion-input
                  v-model="password"
                  name="password"
                  type="password"
                  required
                ></ion-input>
              </ion-item>

              <ion-text color="danger">
                <p
                  v-show="!passwordValid()"
                  padding-left
                  v-text="errorPassword"
                ></p>
              </ion-text>

              <ion-item>
                <ion-label position="stacked" color="primary">Confirm Password</ion-label >
                <ion-input
                  v-model="passwordconfirm"
                  name="passwordconfirm"
                  type="password"
                  required
                ></ion-input>
              </ion-item>

              <ion-text color="danger">
                <p
                  v-show="!passwordconfirmValid()"
                  padding-left
                  v-text="errorPasswordconfirm"
                ></p>
              </ion-text>

              <ion-item>
                <ion-label position="stacked" color="primary">Security Code</ion-label>
                <ion-input
                  v-model="token"
                  name="token"
                  type="text"
                  spellcheck="false"
                  autocapitalize="off"
                  required
                ></ion-input>
              </ion-item>
              <ion-item>
              <p>Check your inbox for your security code!</p>
              </ion-item>
            </ion-list>

            <ion-row responsive-sm>
              <ion-col>
                <ion-button
                  type="submit"
                  expand="block">
                  Update Password
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
  IonRow,
  loadingController
} from "@ionic/vue";
import { defineComponent } from "vue";

import { resetPassword } from "@/service/AuthService";
import { showToast } from "@/utils";

export default defineComponent({
  name: "ResetPassword",
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
      token: "",
      email: "",
      password: "",
      passwordconfirm: "",
      errorPassword: "",
      errorPasswordconfirm: "",
      onceSubmitted: false,
    };
  },
  created() {
    this.email = decodeURIComponent(this.$route.query.email as string);
  },
  methods: {
    async showLoading() {
      const loading = await loadingController.create({
        message: "Please wait...",
      });

      await loading.present();
    },
    emailValid() {
      var re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

      if (this.email == null || this.email == "") {
        if (this.onceSubmitted) {
          return false;
        }
      } else if (!re.test(this.email)) {
        return false;
      }

      return true;
    },
    passwordValid() {
      if (this.onceSubmitted) {
        if (this.password == null || this.password == "") {
          this.errorPassword = "Password is required";
          return false;
        } else if (this.password.length < 6) {
          this.errorPassword = "Password is too short. (Minimum length is 6)";
          return false;
        }
      }

      this.errorPassword = "";
      return true;
    },
    passwordconfirmValid() {
      if (this.onceSubmitted) {
        if (this.password != this.passwordconfirm) {
          this.errorPasswordconfirm =
            "Password confirm does not match with password";
          return false;
        }
      }

      this.errorPasswordconfirm = "";
      return true;
    },
    async resetPassword() {
      this.onceSubmitted = true;

      if (!this.emailValid() || !this.passwordValid() || !this.passwordconfirmValid()) {
        return;
      }

      await this.showLoading();
      const resetSuccess = await resetPassword({ 
        email: this.email,
        password: this.password,
        password_confirmation: this.passwordconfirm,
        token: this.token  
      });
      loadingController.dismiss();

      if (resetSuccess) {
          this.$router.push("/login");
          showToast("Your password has been reset!");
      } else {
          showToast("Couldn't reset password! Please try again.");
      }
    },
  },
});
</script>