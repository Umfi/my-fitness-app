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
                  <form novalidate>
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
                        <p v-show="!emailValid || submitted == true" padding-left>E-Mail is required</p>
                      </ion-text>
                    </ion-list>

                    <ion-row responsive-sm>
                      <ion-col>
                        <ion-button @click="onResetPassword(resetPasswordForm)" type="submit" expand="block">Send password reset link</ion-button>
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
  name: 'ForgotPassword',
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
      email: "",
      submitted: false
    }
  },
  methods: {
     emailValid() {
      return true;
    },
    onResetPassword(ev) {
      ev.preventDefault();
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