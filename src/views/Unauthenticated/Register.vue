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
          <ion-card-title>Register</ion-card-title>
        </ion-card-header>
        <ion-card-content>
          <form novalidate @submit.prevent="register">
            <ion-list>
              <ion-item>
                <ion-label position="stacked" color="primary">Name</ion-label>
                <ion-input
                  v-model="name"
                  name="name"
                  type="text"
                  spellcheck="true"
                  autocapitalize="off"
                  required
                ></ion-input>
              </ion-item>
              <ion-text color="danger">
                <p v-show="!nameValid()" padding-left v-text="errorName"></p>
              </ion-text>

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
                <p v-show="!emailValid()" padding-left v-text="errorEmail"></p>
              </ion-text>

              <ion-item>
                <ion-label position="stacked" color="primary"
                  >Password</ion-label
                >
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
                <ion-label position="stacked" color="primary"
                  >Confirm Password</ion-label
                >
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
            </ion-list>

            <ion-row responsive-sm>
              <ion-col>
                <ion-button type="submit" expand="block">Register</ion-button>
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
  loadingController,
} from "@ionic/vue";
import { defineComponent } from "vue";

import { register } from "@/service/AuthService.js";

export default defineComponent({
  name: "Register",
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
      name: "",
      email: "",
      password: "",
      passwordconfirm: "",
      errorName: "",
      errorEmail: "",
      errorPassword: "",
      errorPasswordconfirm: "",
      onceSubmitted: false,
    };
  },
  methods: {
    nameValid() {
      var re = /^([a-zA-Z ]){2,30}$/;

      if (this.onceSubmitted) {
        if (this.name == null || this.name == "") {
          this.errorName = "Name is required";
          return false;
        } else if (!re.test(this.name)) {
          this.errorName = "Please enter a valid name (Only letters A-Z)";
          return false;
        }
      }

      this.errorName = "";
      return true;
    },
    emailValid() {
      var re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

      if (this.onceSubmitted) {
        if (this.email == null || this.email == "") {
          this.errorEmail = "E-Mail is required";
          return false;
        } else if (!re.test(this.email)) {
          this.errorEmail = "Please enter a valid E-Mail";
          return false;
        }
      }

      this.errorEmail = "";
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
    async showToast(msg) {
      const toast = await toastController.create({
        message: msg,
        duration: 2000,
      });
      toast.present();
    },
    async showLoading() {
      const loading = await loadingController.create({
        message: "Please wait...",
      });

      await loading.present();
    },
    async register() {
     
      this.onceSubmitted = true;

      if (!this.nameValid() || !this.emailValid() || !this.passwordValid() || !this.passwordconfirmValid()) {
        return;
      }

      await this.showLoading();

      let name = this.name;
      let email = this.email;
      let password = this.password;
      let password_confirmation = this.passwordconfirm;

      let registerSuccessful = await register({
        name,
        email,
        password,
        password_confirmation,
      });

      loadingController.dismiss();
      if (registerSuccessful) {
        this.$router.push("/login");
        this.showToast("Registration succesful!");
        this.onceSubmitted = false;
        this.name = "";
        this.email = "";
        this.password = "";
        this.password_confirmation = "";
      } else {
        this.showToast("Registration failed!");
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