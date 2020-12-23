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
                        <p v-show="!nameValid || submitted == true" padding-left>Name is required</p>
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
                        <p v-show="!emailValid || submitted == true" padding-left>E-Mail is required</p>
                      </ion-text>

                      <ion-item>
                        <ion-label position="stacked" color="primary">Password</ion-label>
                        <ion-input v-model="password" name="password" type="password" required></ion-input>
                      </ion-item>

                      <ion-text color="danger">
                        <p v-show="!passwordValid || submitted == true" padding-left>Password is required</p>
                      </ion-text>

                      <ion-item>
                        <ion-label position="stacked" color="primary">Confirm Password</ion-label>
                        <ion-input v-model="passwordconfirm" name="passwordconfirm" type="password" required></ion-input>
                      </ion-item>

                      <ion-text color="danger">
                        <p v-show="!passwordconfirmValid || submitted == true" padding-left>Password is required</p>
                      </ion-text>

                    </ion-list>

                    <ion-row responsive-sm>
                      <ion-col>
                        <ion-button type="submit" expand="block">Register</ion-button>
                      </ion-col>
                    </ion-row>
                  </form>
          </ion-card-content>
      </ion-card>


    </ion-content>
  </ion-page>
</template>

<script>
import { IonContent,IonHeader,IonPage,IonTitle,IonToolbar,IonCard,IonCardHeader,IonCardContent,IonCardTitle,IonLabel,IonInput,IonItem,IonList,IonText,IonButton,IonCol,IonRow} from '@ionic/vue';
import { defineComponent } from 'vue';

export default defineComponent({
  name: 'Register',
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
    IonRow
  },
  data() {
    return {
      name: "",
      email: "",
      password: "",
      passwordconfirm: "",
      submitted: false
    }
  },
  methods: {
     nameValid() {
      return true;
    },
     emailValid() {
      return true;
    },
    passwordValid() {
      return true;
    },
    passwordconfirmValid() {
      return true;
    },
    register: function() {
        let name = this.name
        let email = this.email
        let password = this.password
        let password_confirmation = this.passwordconfirm
        this.$store.dispatch('register', { name, email, password, password_confirmation})
       .then(() => this.$router.push('/login'))
       .catch(err => console.log(err))

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