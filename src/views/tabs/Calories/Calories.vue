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
    
    <ion-row v-show="renderContent">
      <ion-col size="10">
        <ion-searchbar v-model="searchTerm" @change="search($event.target.value, 1)" @ionInput="suggest($event.target.value)" @ionClear="searchResult = []"></ion-searchbar>
      </ion-col>
       <ion-col size="2">
          <ion-button class="ion-float-end" style="margin-top: 11px;" @click="scanBarcode()">
            <ion-icon slot="icon-only" :icon="barcodeOutline"></ion-icon>
          </ion-button>
      </ion-col>
      <ion-col size="12">
        <ion-card class="suggestions-card" v-if="filteredSuggestions.length">
          <ion-item v-for="suggestion in filteredSuggestions.slice(0, 10)" :key="suggestion.id" @click="selectSuggestion(suggestion.name)">{{suggestion.name}}</ion-item>
        </ion-card>
      </ion-col>
      <ion-col size="12">
         <ion-segment @ionChange="searchFilterChanged($event.target.value)" :value="searchFilter">
          <ion-segment-button value="all">
            <ion-label>Search Results</ion-label>
          </ion-segment-button>
          <ion-segment-button value="today">
            <ion-label>Today</ion-label>
          </ion-segment-button>
        </ion-segment>
        </ion-col>
    </ion-row>

    <ion-content class="ion-padding" v-show="renderContent">

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
                        <ion-icon v-if="item.scanned" :icon="barcodeOutline"></ion-icon>
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


      <ion-list v-if="today && !isSearching && searchFilter == 'today'" class="search-history-list">
        <ion-item-sliding v-for="item in today" :key="item.id">
          <ion-item>
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
            <ion-item-option color="danger" @click="removeCalories(item)">
              <ion-icon slot="top" :icon="trash" class="ion-margin-bottom"></ion-icon>
              Untrack
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

    <ion-row v-show="isScanning">
      <ion-col class="ion-no-padding">
        <ion-button expand="full" @click="stopScan()" >Stop Scanning</ion-button>
      </ion-col>
    </ion-row>
  </ion-page>
</template>

<script lang="ts">
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
  IonButton,
  IonFab,
  IonFabButton,
  IonIcon,
  IonButtons,
  IonMenuButton,
  IonGrid,
  IonCol,
  IonRow,
  IonCard,
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
  RefresherCustomEvent,
  InfiniteScrollCustomEvent
} from "@ionic/vue";

import { add, create, trash, timeOutline, personCircleOutline, barcodeOutline } from "ionicons/icons";

import ModalAddCalories from './ModalAddCalories.vue'
import ModalManageProduct from "./ModalManageProduct.vue";


import { BarcodeScanner } from '@capacitor-community/barcode-scanner';
import { Keyboard } from '@capacitor/keyboard';
import { Capacitor } from '@capacitor/core';

import { SearchResultModel, SearchHistoryModel, TodayResultModel, searchProduct, searchProductByBarcode, removeProduct, untrackCalories } from "@/service/ProductService";
import { showToast } from "@/utils";


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
    IonButton,
    IonThumbnail,
    IonFabButton,
    IonIcon,
    IonButtons,
    IonMenuButton,
    IonGrid,
    IonCard,
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
    IonInfiniteScrollContent
  },
  data() {
    return {
      suggestions: [] as Array<SearchHistoryModel>,
      filteredSuggestions: [] as Array<SearchHistoryModel>,
      searchResult: [] as Array<SearchResultModel>,
      today: [] as Array<TodayResultModel>,
      searchTerm: "",
      searchFilter: "all",
      isSearching: false,
      hideAll: false,
      page: 1,
      maxResults: 400,
      isScanning: false,
      renderContent: false
    };
  },
  ionViewDidEnter() {
    this.renderContent = true;
  },
  ionViewWillLeave() {
    this.stopScan();
    this.renderContent = false;
  },
  setup() {
    return {
      add,
      create,
      trash,
      timeOutline,
      personCircleOutline,
      barcodeOutline
    };
  },
  created() {
    this.page = 1;
    this.doRefresh();
  },
  methods: {
    doRefresh(event?: RefresherCustomEvent) {
        this.search(this.searchTerm, 1);
        window.dispatchEvent(new Event('resize'));
        if (event) event.target.complete();
    },
    loadData(ev: InfiniteScrollCustomEvent) {
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
    suggest(input: string) {
      if (input == "") {
        this.filteredSuggestions = [];
      } else {
        this.filteredSuggestions = this.suggestions.filter(function(suggestion) {
            return suggestion.name.toLowerCase().includes(input.toLowerCase());
        });
      }
    },
    selectSuggestion(suggestion: string) {
      this.searchTerm = suggestion;
      this.filteredSuggestions = [];
      var that = this;
      setTimeout(function(){
          that.search(suggestion, 1);
      }, 200);
    },
    async search(searchTerm: string, page: number) {

      if (Capacitor.isPluginAvailable('Keyboard')) {
        Keyboard.hide();
      }
       
      if (page == 1) {
        this.isSearching = true;
      } 
      
      const results = await searchProduct(searchTerm, page);
      if (results != null) {
          this.suggestions = results.searchHistory;
          this.filteredSuggestions = [];

          if (page > 1) {
            this.searchResult.push(...results.searchResult);
          } else {
            this.page = 1;
            this.searchResult = results.searchResult;
          }
          
          this.today = results.todayResults;
          this.maxResults = results.maxResults;
          
          this.filterToday(searchTerm);
          this.isSearching = false;


          if ((this.searchResult.length == 0 && searchTerm != "" && this.searchFilter == "all") || (this.today.length == 0 && searchTerm != "" && this.searchFilter == "today"))  {
            showToast("No products found.");
          }
      }
    },
    searchFilterChanged(filter: string) {
      this.searchTerm = "";
      this.searchFilter = filter;

      if (this.searchTerm == "" && this.searchFilter == "all") {
        this.searchResult = [];
      } 
    },
    filterToday(searchTerm: string) {
      if (this.searchFilter == "today" && searchTerm != "") {
        this.today = this.today.filter(function(value){ 
          return value.name.toUpperCase().indexOf(searchTerm.toUpperCase()) > -1
        });
      }
    },
    stopScan() {
      BarcodeScanner.stopScan();
      this.renderContent = true;
      this.isScanning = false;
    },
    async scanBarcode() {
      this.isScanning = true;
      try {
        this.renderContent = false;

        const scanResult = await BarcodeScanner.startScan();
        if (scanResult.hasContent && scanResult.content) {
          this.renderContent = true;
          this.isScanning = false;
          const scannedProduct = await searchProductByBarcode(scanResult.content);
          if (scannedProduct != null) {
            this.searchTerm = scannedProduct.name;
            await this.search(scannedProduct.name, 1);
            if (scannedProduct.show) {
              this.searchResult.unshift(scannedProduct);
            }
          } else {
            showToast("No product found.");
          }
        }
      } catch (e) {
        console.error(e);
      }

    },
    async addCalories(itm: SearchResultModel) {
      const modal = await modalController
        .create({
          component: ModalAddCalories,
          componentProps: {
            item: itm,
            parent: this
          },
        })
      return modal.present();
    },
    async removeCalories(itm: TodayResultModel) {
        const alert = await alertController
        .create({
          header: 'Untrack Item!',
          message: 'Do you really want to untrack this item?',
          buttons: [
            {
              text: 'Cancel',
              role: 'cancel',
              cssClass: 'secondary',
            },
            {
              text: 'Yes',
              handler: async () => {
                
                const deleted = await untrackCalories(itm.id);

                if (deleted) {
                  showToast("Product untracked.");
                  this.doRefresh();
                } else {
                  showToast("Couldn't untrack product.");
                }

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
    async editItem(itm: SearchResultModel) {
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
    async deleteItem(item: SearchResultModel) {

      const alert = await alertController
        .create({
          header: 'Delete Item!',
          message: 'Do you really want to delete this item?',
          buttons: [
            {
              text: 'Cancel',
              role: 'cancel',
              cssClass: 'secondary',
            },
            {
              text: 'Yes',
              handler: async () => {
                
                const deleted = await removeProduct(item.name, item.id);

                if (deleted) {
                  showToast("Product deleted.");
                  this.doRefresh();
                } else {
                  showToast("Couldn't delete product.");
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

.suggestions-card {
  margin-top: 0;
  position: absolute;
  left: 5px;
  right: 5px;
  z-index: 10;
}
</style>