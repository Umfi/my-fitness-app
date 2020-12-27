<template>
  <ion-page>
    <ion-header :translucent="true">
      <ion-toolbar>
        <ion-buttons slot="start">
          <ion-menu-button></ion-menu-button>
        </ion-buttons>

        <ion-title>My Fitness App</ion-title>
      </ion-toolbar>
    </ion-header>

    <ion-row >
      <ion-col size="12">
        <ion-searchbar v-model="searchTerm" @change="search($event.target.value, 1)"></ion-searchbar>
      </ion-col>
        <ion-col size="12">
         <ion-segment @ionChange="searchFilterChanged($event.target.value)" :value="searchFilter">
          <ion-segment-button value="all">
            <ion-label>All</ion-label>
          </ion-segment-button>
          <ion-segment-button value="history">
            <ion-label>History</ion-label>
          </ion-segment-button>
        </ion-segment>
        </ion-col>
    </ion-row>

 

    <ion-content class="ion-padding">

      <ion-refresher slot="fixed" @ionRefresh="doRefresh($event)">
        <ion-refresher-content> </ion-refresher-content>
      </ion-refresher>

      <ion-list v-if="searchResult && !isSearching && searchFilter == 'all'" class="search-results-list">

        <ion-item-sliding v-for="item in searchResult" :key="item.id">
          <ion-item @click="addCalories(item)">
            <ion-label>
              <ion-grid>
                <ion-row>
                  <ion-col size="11">
                    <strong>{{ item.name }} (  {{ parseInt(item.calories) }} kcal )</strong>
                  </ion-col>
                  <ion-col size="1">
                    <ion-icon v-if="item.editable && item.deletable" :icon="personCircleOutline"></ion-icon>
                    <ion-icon v-if="!item.editable && item.deletable" :icon="timeOutline"></ion-icon>
                  </ion-col>
                </ion-row>
                <ion-row>
                  <ion-col size="12">
                    {{ item.brand }}
                  </ion-col>
                </ion-row>
                <ion-row>
                  <ion-col size="12">
                    <small>Protein: {{ parseInt(item.protein) }} g | Carbs: {{ parseInt(item.carbohydrate) }} g | Fat: {{ parseInt(item.fat) }} g</small>
                  </ion-col>
                </ion-row>
              </ion-grid>
            </ion-label>
          </ion-item>

          <ion-item-options>
            <ion-item-option color="secondary" @click="editItem(item)" v-if="item.editable">
              <ion-icon slot="top" :icon="create" class="ion-margin-bottom"></ion-icon>
              Edit
            </ion-item-option>
            <ion-item-option color="danger" @click="deleteItem(item)" v-if="item.deletable">
              <ion-icon slot="top" :icon="trash" class="ion-margin-bottom"></ion-icon>
              Delete
            </ion-item-option>
          </ion-item-options>

        </ion-item-sliding>
      </ion-list>

      <ion-infinite-scroll v-if="searchResult && !isSearching && searchFilter == 'all'"
        @ionInfinite="loadData($event)" 
        threshold="100px" 
        id="infinite-scroll"
      >
        <ion-infinite-scroll-content
          loading-spinner="bubbles"
          loading-text="Loading more data...">
        </ion-infinite-scroll-content>
      </ion-infinite-scroll>


      <ion-list v-if="history && !isSearching && searchFilter == 'history'" class="search-history-list">
        <ion-item-sliding v-for="item in history" :key="item.id">
          <ion-item @click="addCalories(item)">
            <ion-label>
              <ion-grid>
                <ion-row>
                  <ion-col size="12">
                    <strong>{{ item.name }} (  {{ parseInt(item.calories) }} kcal )</strong>
                  </ion-col>
                </ion-row>
                <ion-row>
                  <ion-col size="12">
                    {{ item.brand }}
                  </ion-col>
                </ion-row>
                <ion-row>
                  <ion-col size="12">
                    <small>Protein: {{ parseInt(item.protein) }} g | Carbs: {{ parseInt(item.carbohydrate) }} g | Fat: {{ parseInt(item.fat) }} g</small>
                  </ion-col>
                </ion-row>
              </ion-grid>
            </ion-label>
          </ion-item>

          <ion-item-options>
            <ion-item-option color="secondary" @click="editItem(item)" v-if="item.editable">
              <ion-icon slot="top" :icon="create" class="ion-margin-bottom"></ion-icon>
              Edit
            </ion-item-option>
            <ion-item-option color="danger" @click="deleteItem(item)" v-if="item.deletable">
              <ion-icon slot="top" :icon="trash" class="ion-margin-bottom"></ion-icon>
              Delete
            </ion-item-option>
          </ion-item-options>

        </ion-item-sliding>
      </ion-list>

      
      <ion-list v-if="isSearching">
        <ion-item v-for="n in 10" :key="n">
          <ion-label>
            <ion-grid>
              <ion-row>
                <ion-col size="12">
                  <ion-skeleton-text animated style="width: 50%"></ion-skeleton-text>
                </ion-col>
              </ion-row>
              <ion-row>
                <ion-col size="12">
                  <ion-skeleton-text animated style="width: 30%"></ion-skeleton-text>
                </ion-col>
              </ion-row>
              <ion-row>
                <ion-col size="12">
                  <ion-skeleton-text animated style="width: 90%"></ion-skeleton-text>
                </ion-col>
              </ion-row>
            </ion-grid>
          </ion-label>
        </ion-item>
      </ion-list>

      <ion-fab-button ref="addProductBtn" class="fab-add" @click="addProduct">
        <ion-icon :icon="add"></ion-icon>
      </ion-fab-button>
    </ion-content>
  </ion-page>
</template>

<script>
import { defineComponent } from "vue";
import {
  IonContent,
  IonHeader,
  IonPage,
  IonTitle,
  IonToolbar,
  IonSearchbar,
  IonList,
  IonItem,
  IonFabButton,
  IonIcon,
  IonButtons,
  IonMenuButton,
  IonGrid,
  IonCol,
  IonRow,
  IonLabel,
  IonSkeletonText,
  IonSegment,
  IonSegmentButton,
  IonItemOptions,
  IonItemOption,
  IonItemSliding,
  IonRefresher,
  IonRefresherContent,
  IonInfiniteScroll, 
  IonInfiniteScrollContent,
  modalController,
  alertController,
  toastController
} from "@ionic/vue";

import { add, create, trash, timeOutline, personCircleOutline } from "ionicons/icons";

import ModalAddCalories from './ModalAddCalories.vue'
import ModalManageProduct from "./ModalManageProduct.vue";

import { Capacitor, Plugins } from '@capacitor/core';

const { Keyboard } = Plugins;

import { config } from "../config.js"
import $axios from "../axios.js"

export default defineComponent({
  name: "Calories",
  components: {
    IonContent,
    IonHeader,
    IonPage,
    IonTitle,
    IonToolbar,
    IonSearchbar,
    IonList,
    IonItem,
    IonFabButton,
    IonIcon,
    IonButtons,
    IonMenuButton,
    IonGrid,
    IonCol,
    IonRow,
    IonLabel,
    IonSkeletonText,
    IonSegment,
    IonSegmentButton,
    IonItemOptions,
    IonItemOption,
    IonItemSliding,
    IonRefresher,
    IonRefresherContent,
    IonInfiniteScroll, 
    IonInfiniteScrollContent,
  },
  data() {
    return {
      searchResult: [],
      history: [],
      searchTerm: "",
      searchFilter: "all",
      isSearching: false,
      page: 1,
      maxResults: 400
    };
  },
  setup() {
    return {
      add,
      create,
      trash,
      timeOutline,
      personCircleOutline
    };
  },
  created() {
    this.page = 1;
    this.doRefresh(false);
  },
  methods: {
    doRefresh(event) {
        this.search(this.searchTerm, 1);
        if (event) event.target.complete();
    },
    async showToast(msg) {
      const toast = await toastController.create({
        message: msg,
        duration: 2000,
      });
      toast.present();
    },
    loadData(ev) {
      setTimeout(() => {
        this.page += 1;
        this.search(this.searchTerm, this.page);
        ev.target.complete();

        // App logic to determine if all data is loaded
        // and disable the infinite scroll
        if (this.searchResult.length == this.maxResults) {
          ev.target.disabled = true;
        }
      }, 500);
    },
    search(searchTerm, page) {

      if (Capacitor.isPluginAvailable('Keyboard')) {
        Keyboard.hide();
      }
       
      if (page == 1) {
        this.isSearching = true;
      } 
      
      $axios.get(config.API_BASE_URL + "foodsearch?name=" + searchTerm + "&page=" + page)
        .then((response) => {
          
          if (page > 1) {
            this.searchResult.push(...response.data.searchResult);
          } else {
            this.page = 1;
            this.searchResult = response.data.searchResult;
          }
          
          this.history = response.data.searchHistory;
          this.maxResults = response.data.maxResults;
          
          this.filterHistory(searchTerm);
          this.isSearching = false;


          if ((this.searchResult.length == 0 && searchTerm != "" && this.searchFilter == "all") || (this.history.length == 0 && searchTerm != "" && this.searchFilter == "history"))  {
            this.showToast("No products found.");
          }
        });
      
    },
    searchFilterChanged(filter) {
      this.searchFilter = filter;
      this.filterHistory(this.searchTerm);

      if (this.searchTerm == "" && filter == "all") {
        this.searchResult = [];
      } 
    },
    filterHistory(searchTerm) {
      if (this.searchFilter == "history" && searchTerm != "") {
        this.history = this.history.filter(function(value){ 
          return value.name.toUpperCase().indexOf(searchTerm.toUpperCase()) > -1
        });
      }
    },
    async addCalories(itm) {

      const modal = await modalController
        .create({
          component: ModalAddCalories,
          componentProps: {
            item: itm
          },
        })
      return modal.present();
    },
    async deleteItem(item) {

      const alert = await alertController
        .create({
          header: 'Delete Item!',
          message: 'Do you really want to delete this item from your history?',
          buttons: [
            {
              text: 'Cancel',
              role: 'cancel',
              cssClass: 'secondary',
            },
            {
              text: 'Okay',
              handler: () => {
                
                $axios.post(config.API_BASE_URL + "deleteProduct", {
                    name: item.name,
                    id: item.id
                }).then((response) => {
                  if (response.data.status) {
                    this.showToast("Product deleted.");

                    this.doRefresh(false);

                  } else {
                    this.showToast("Couldn't delete product.");
                  }
                }).catch(() => {
                  this.showToast("Couldn't delete product.");
                });

              },
            },
          ],
        });
      return alert.present();
    },
    async addProduct() {
      const modal = await modalController
        .create({
          component: ModalManageProduct,
          componentProps: {
            item: null,
            title: "Create new product",
            mode: "create",
            parent: this
          },
        })
      return modal.present();
    },
    async editItem(itm) {
      const modal = await modalController
        .create({
          component: ModalManageProduct,
          componentProps: {
            item: itm,
            title: "Edit product",
            mode: "edit",
            parent: this
          },
        })
      return modal.present();
    },
  },
});
</script>


<style scoped>
.fab-add {
  position: fixed;
  bottom: 25px;
  right: 15px;
  font-size: 30px;
}
</style>