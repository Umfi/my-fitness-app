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
          <ion-card-title>Login</ion-card-title>
        </ion-card-header>
        <ion-card-content>
          <form novalidate id="loginform" @submit.prevent="login">
            <ion-list>
              <ion-item>
                <ion-label position="stacked" color="primary">E-Mail</ion-label>
                <ion-input
                  id="email"
                  v-model="email"
                  name="email"
                  type="email"
                  spellcheck="false"
                  autocapitalize="off"
                  required
                ></ion-input>
              </ion-item>

              <ion-text id="emailValidationText" color="danger">
                <p v-show="!emailValid()" v-text="errorEmail" padding-left></p>
              </ion-text>

              <ion-item>
                <ion-label position="stacked" color="primary"
                  >Password</ion-label
                >
                <ion-input
                  id="password"
                  v-model="password"
                  name="password"
                  type="password"
                  spellcheck="false"
                  autocapitalize="off"
                  required
                ></ion-input>
              </ion-item>

              <ion-text id="passwordValidationText" color="danger">
                <p
                  v-show="!passwordValid()"
                  v-text="errorPassword"
                  padding-left
                ></p>
              </ion-text>
            </ion-list>

            <ion-row responsive-sm>
              <ion-col>
                <ion-button id="loginBtn" type="submit" expand="block" :disabled="disableSend">Login</ion-button>
              </ion-col>
            </ion-row>

            <ion-row responsive-sm>
               <ion-col size="12" class="ion-text-center">
                <ion-label><a href="/forgotPassword">Forgot password?</a></ion-label>
              </ion-col>
              <ion-col size="12" class="ion-text-center">
                <ion-label>Don't have an account? <a href="/register">Sign up now!</a></ion-label>
              </ion-col>
            </ion-row>
          </form>
        </ion-card-content>
      </ion-card>
    </ion-content>
  </ion-page>
</template>

<script>
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
  toastController,
  loadingController
} from "@ionic/vue";
import { defineComponent } from "vue";

import { login } from "@/service/AuthService.js";

export default defineComponent({
  name: "Login",
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
      password: "",
      errorPassword: "",
      onceSubmitted: false,
      disableSend: false
    };
  },
  methods: {
    emailValid() {
      var re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

      if (this.email == null || this.email == "" || !this.email.trim()) {
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
    passwordValid() {
      if (this.password == null || this.password == "") {
        if (this.onceSubmitted) {
          this.errorPassword = "Password is required";
          return false;
        }
      }

      this.errorPassword = "";
      return true;
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
    async login() {

      this.onceSubmitted = true;

      let email = this.email;
      let password = this.password;

      if (!this.emailValid() || !this.passwordValid()) {
        return;
      }

      await this.showLoading();
      this.disableSend = true;
      let loginSuccessful = await login({ email, password });
      this.disableSend = false;
      
      loadingController.dismiss()

      if (loginSuccessful) {
          this.$router.push("/tabs/overview");
          this.showToast("Login succesful!");
          this.onceSubmitted = false;
          this.email = "";
          this.password = "";
      } else {
          this.password = "";
          this.showToast("Login failed!");
      }  

    },
  },
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