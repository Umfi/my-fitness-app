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
                  <ion-col size="3">
                    <vc-donut :size="50" :thickness="20" :total="(parseInt(item.protein) + parseInt(item.carbohydrate) + parseInt(item.fat)) || 100" :sections="[{ label: 'Protein', value: parseInt(item.protein), color: '#2dd36f' }, { label: 'Carbs', value: parseInt(item.carbohydrate), color: '#ffc409' }, { label: 'Fat', value: parseInt(item.fat), color: '#eb445a' }]" class="ion-margin-top"><h3>{{ parseInt(item.calories) }} </h3></vc-donut>
                  </ion-col>
                  <ion-col size="9">
                    <ion-row style="margin-top: 10px">
                      <ion-col size="11">
                        <strong class="ion-text-wrap">{{ item.name }}</strong>
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
                  </ion-col>
                </ion-row>
                <ion-row>
                  <ion-col size="4">
                    <ion-chip color="success" outline>
                        <ion-label class="chip-font">Protein: {{ parseInt(item.protein) }}g</ion-label>
                    </ion-chip>
                  </ion-col>
                  <ion-col size="4">
                      <ion-chip color="warning" outline>
                        <ion-label class="chip-font">Carbs: {{ parseInt(item.carbohydrate) }}g</ion-label>
                    </ion-chip>
                  </ion-col>
                  <ion-col size="4">
                    <ion-chip color="danger" outline>
                        <ion-label class="chip-font">Fat: {{ parseInt(item.fat) }}g</ion-label>
                    </ion-chip>
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
                  <ion-col size="3">
                    <vc-donut :size="50" :thickness="20" :total="(parseInt(item.protein) + parseInt(item.carbohydrate) + parseInt(item.fat)) || 100" :sections="[{ label: 'Protein', value: parseInt(item.protein), color: '#2dd36f' }, { label: 'Carbs', value: parseInt(item.carbohydrate), color: '#ffc409' }, { label: 'Fat', value: parseInt(item.fat), color: '#eb445a' }]" class="ion-margin-top"><h3>{{ parseInt(item.calories) }} </h3></vc-donut>
                  </ion-col>
                  <ion-col size="9">
                    <ion-row style="margin-top: 10px">
                      <ion-col size="12">
                        <strong class="ion-text-wrap">{{ item.name }}</strong>
                      </ion-col>
                    </ion-row>
                    <ion-row>
                      <ion-col size="12">
                        {{ item.brand }}
                      </ion-col>
                    </ion-row>
                  </ion-col>
                </ion-row>
                <ion-row>
                  <ion-col size="4">
                    <ion-chip color="success" outline>
                        <ion-label class="chip-font">Protein: {{ parseInt(item.protein) }}g</ion-label>
                    </ion-chip>
                  </ion-col>
                  <ion-col size="4">
                      <ion-chip color="warning" outline>
                        <ion-label class="chip-font">Carbs: {{ parseInt(item.carbohydrate) }}g</ion-label>
                    </ion-chip>
                  </ion-col>
                  <ion-col size="4">
                    <ion-chip color="danger" outline>
                        <ion-label class="chip-font">Fat: {{ parseInt(item.fat) }}g</ion-label>
                    </ion-chip>
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
                <ion-col size="3">
                  <ion-thumbnail>
                    <ion-skeleton-text></ion-skeleton-text>
                  </ion-thumbnail>
                </ion-col>
                <ion-col size="9">
                  <ion-row>
                    <ion-col size="12">
                      <ion-skeleton-text animated style="width: 70%"></ion-skeleton-text>
                    </ion-col>
                  </ion-row>
                  <ion-row>
                    <ion-col size="12">
                      <ion-skeleton-text animated style="width: 40%"></ion-skeleton-text>
                    </ion-col>
                  </ion-row>
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
      
      <ion-fab vertical="bottom" horizontal="end" slot="fixed">
        <ion-fab-button ref="addProductBtn" @click="addProduct">
          <ion-icon :icon="add"></ion-icon>
        </ion-fab-button>
      </ion-fab>
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
  IonFab,
  IonFabButton,
  IonIcon,
  IonButtons,
  IonMenuButton,
  IonGrid,
  IonCol,
  IonRow,
  IonLabel,
  IonChip,
  IonThumbnail,
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

import { searchProduct, removeProduct } from "@/service/ProductService.js";

import  Donut  from 'vue-css-donut-chart/src/components/Donut';
//import 'vue-css-donut-chart/dist/vcdonut.css';

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
    IonFab,
    IonChip,
    IonThumbnail,
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
    'vc-donut' : Donut
  },
  data() {
    return {
      searchResult: [],
      history: [],
      searchTerm: "",
      searchFilter: "all",
      isSearching: false,
      hideAll: false,
      page: 1,
      maxResults: 400,
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
        window.dispatchEvent(new Event('resize'));
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
        window.dispatchEvent(new Event('resize'));
        ev.target.complete();
        
        // App logic to determine if all data is loaded
        // and disable the infinite scroll
        if (this.searchResult.length == this.maxResults) {
          ev.target.disabled = true;
        }
      }, 500);
    },
    async search(searchTerm, page) {

      if (Capacitor.isPluginAvailable('Keyboard')) {
        Keyboard.hide();
      }
       
      if (page == 1) {
        this.isSearching = true;
      } 
      
      const results = await searchProduct(searchTerm, page);
      if (results != null) {
          if (page > 1) {
            this.searchResult.push(...results.searchResult);
          } else {
            this.page = 1;
            this.searchResult = results.searchResult;
          }
          
          this.history = results.searchHistory;
          this.maxResults = results.maxResults;
          
          this.filterHistory(searchTerm);
          this.isSearching = false;


          if ((this.searchResult.length == 0 && searchTerm != "" && this.searchFilter == "all") || (this.history.length == 0 && searchTerm != "" && this.searchFilter == "history"))  {
            this.showToast("No products found.");
          }
      }
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
              handler: async () => {
                
                const deleted = await removeProduct({
                    name: item.name,
                    id: item.id
                });

                if (deleted) {
                  this.showToast("Product deleted.");
                  this.doRefresh(false);
                } else {
                  this.showToast("Couldn't delete product.");
                }

              },
            },
          ],
        });
      return alert.present();
    },
  },
});
</script>
<style scoped>
.chip-font {
  font-size: 11px;
}
</style>