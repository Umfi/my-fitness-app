import { createApp } from 'vue'
import App from './App.vue'
import router from './router'

import { IonicVue } from '@ionic/vue'

/* Core CSS required for Ionic components to work properly */
import '@ionic/vue/css/core.css';

/* Basic CSS for apps built with Ionic */
import '@ionic/vue/css/normalize.css';
import '@ionic/vue/css/structure.css';
import '@ionic/vue/css/typography.css';

/* Optional CSS utils that can be commented out */
import '@ionic/vue/css/padding.css';
import '@ionic/vue/css/float-elements.css';
import '@ionic/vue/css/text-alignment.css';
import '@ionic/vue/css/text-transformation.css';
import '@ionic/vue/css/flex-utils.css';
import '@ionic/vue/css/display.css';

/* Theme variables */
import './theme/variables.css';

import { SplashScreen } from '@capacitor/splash-screen';
import { get } from "@/helper/storage";

import Donut from 'vue-css-donut-chart';
import 'vue-css-donut-chart/dist/vcdonut.css';

const app = createApp(App)
  .use(IonicVue)
  .use(router)
  .use(Donut);

router.isReady().then(async () => {

  const selectedTheme = await get("theme");
  if (selectedTheme == "dark") {
    document.body.classList.add("dark");
  } else {
    document.body.classList.remove("dark");
  }

  app.mount('#app');

  SplashScreen.hide();
});