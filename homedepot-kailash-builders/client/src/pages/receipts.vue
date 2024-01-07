<template>
  <div class="q-pa-md">
    <q-page-sticky style="z-index: 10"  position="bottom-right" :offset="[18, 18]">
      <q-fab
        icon="add"
        @click="OpenAddDialog"
        direction="up"
        label="Add"
        color="primary"
      >
      </q-fab>
    </q-page-sticky>
    <q-dialog v-model="confirm" persistent>
      <q-card>
        <q-card-section class="row items-center">
          <q-avatar class="q-mr-sm" icon="done" color="primary" text-color="white" />
          <span class="q-ml-sm">Are You Sure You Want Delete?</span>
        </q-card-section>

        <q-card-actions align="right">
          <q-btn @click="deleteReceipt" flat label="Ok" color="primary" />
          <q-btn flat label="Cancel" color="red-10" v-close-popup />
        </q-card-actions>
      </q-card>
    </q-dialog>
    <q-dialog :maximized="$props.mobileView" v-model="imagesDialog">
      <q-card style="min-width: 60%;min-height: 70%">
        <q-toolbar class="bg-primary text-white text-bold q-pa-md">
          <q-toolbar-title>Receipt</q-toolbar-title>
          <q-btn icon="close" v-close-popup flat></q-btn>
        </q-toolbar>
        <q-card-section>
          <div class="q-pa-md">
            <q-carousel
              animated
              v-model="slide"
              class="no-padding"
              :arrows="false"
              control-color="black"
              :height="allHeight*0.75+'px'"
              infinite
            >
              <q-carousel-slide class="no-padding" :name="0" >
                <q-img :style="'min-height:'+allHeight*0.7+'px;max-height:'+allHeight*0.7+'px'" contain :src="imageUrl"></q-img>
              </q-carousel-slide>
            </q-carousel>
          </div>
        </q-card-section>
      </q-card>
    </q-dialog>
    <q-dialog
      maximized
      transition-show="slide-up"
      transition-hide="slide-down"
      v-model="dialogOpened">
      <q-card>
        <q-toolbar class="bg-primary text-white text-bold q-pa-md">
          <q-toolbar-title>Add New Receipt</q-toolbar-title>
          <q-btn icon="close" v-close-popup flat></q-btn>
        </q-toolbar>
        <q-card-section>
          <div class="row justify-center q-pt-md">
            <div class="col-lg-8 col-md-9 col-sm-11 col-xs-12 pa-2">
              <div class="row">
                <div class="col-12">
                  <simple-form-renderer @dataSaved="saveData" @closeDialog="dialogOpened = false" :form-details="formData"></simple-form-renderer>
                </div>
              </div>
            </div>
          </div>
        </q-card-section>
      </q-card>
    </q-dialog>
    <div style="min-height: 100%;max-height: 100%" class="row">
      <div class="col-lg-6 col-md-6 col-sm-12 col-xs-12">
        <q-input :style="$props.mobileView?'':'min-width: 50%;max-width: 50%'" v-model="search" label="Search For Receipts" outlined class="shadow-1"></q-input>
      </div>
      <div class="col-lg-6 col-md-6 col-sm-12 col-xs-12">
        <div :class="$props.mobileView?'q-pt-md':'text-right'">
          <q-btn @click="SearchReceipt" label="Search" color="primary"></q-btn>
        </div>
      </div>
      <div :key="receipt._id" v-for="receipt in itemData" class="col-xs-12 col-sm-12 col-md-6 col-lg-4 q-pt-lg q-pa-sm">
        <q-card class="my-card">
          <q-card-section>
            <q-item class="q-pa-none">
              <q-item-section>
                <q-item-label class="text-h6 text-bold">{{receipt.name}}</q-item-label>
                <q-item-label caption lines="2"><b>Supplier:</b> {{receipt.supplier.name}}</q-item-label>
              </q-item-section>
              <q-item-section side top>
                <q-item-label><q-btn @click="openDeleteForm(receipt._id)" dense round flat icon="close" color="red">
                </q-btn> </q-item-label>
              </q-item-section>
            </q-item>
            <div ></div>
            <div class="text-subtitle2 text-grey"></div>
          </q-card-section>
          <q-card-section class="q-pt-none">
            <b>Receipt Date:</b> {{ receipt.receipt_date.substring(0,10) }}
            <br>
            <b>Total Amount:</b> Rs.{{ receipt.total_amount }}
          </q-card-section>
          <q-card-actions>
            <q-btn @click="loadImage(receipt._id)" push color="primary"  label="View Receipt"></q-btn>
          </q-card-actions>
        </q-card>
      </div>
      <div class="col-12 q-pt-lg">
        <div class="centerize">
          <q-pagination
            v-model="currentPage"
            :max="totalPage"
            :max-pages="5"
            :ellipses="false"
            :boundary-numbers="false"
            @click="getWarehouse"
          />
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import client from "../api/Client";
import FormData from "../api/formData";
import {
  Loading,

  // optional!, for example below
  // with custom spinner
  QSpinnerGears
} from 'quasar'
let height = window.innerHeight
import {firebaseStorage} from 'boot/firebase'
export default {
  props:['mobileView'],
  data(){
    return{
      allHeight:height,
      slide:0,
      imagesDialog:false,
      fStore:firebaseStorage,
      dialogOpened:false,
      warehouseColumn:[
        {
          name: 'desc',
          required: true,
          label: 'Name',
          align: 'left',
          field: row => row.name,
          sortable: true
        },
        { name: 'brand', align: 'center', label: 'Brand', field: row => row.brand.name, sortable: true },
        { name: 'Cost Per Hour', align: 'center', label: 'Cost Per Hour', field: row => row.cost_per_hour, sortable: true },
        { name: 'Amount Spent', align: 'center', label: 'Amount Spent', field: row => row.amount_spent, sortable: true },
        { name: 'Time Spent', align: 'center', label: 'Time Spent', field: row => row.time_spent+" Hours", sortable: true },
      ],
      dataMode:'add',
      selectedId:'',
      currentPage:1,
      totalPage:1,
      clientState: client,
      formData:[],
      form: new FormData(),
      itemData:[],
      imageUrl:"",
      confirm:false,
      search:"",
    }
  },
  methods:{
    SearchReceipt(){
      this.clientState.getData('receipt/search/'+this.search).then((response)=>{
        this.itemData = response.data
        this.currentPage = response.currentPage
        this.totalPage = response.totalPage
      })
    },
    deleteReceipt(){
      this.clientState.putData('receipt/delete/'+this.selectedId,{},"Receipt Deleted").then((resp)=>{
        this.confirm = false
        this.getWarehouse()
        let desertRef = this.fStore.child('images/'+this.selectedId+'.jpg');
        desertRef.delete().then(() => {
          console.log("File Deleted")
          // File deleted successfully
        }).catch((error) => {
          console.log(error)
          // Uh-oh, an error occurred!
        });
      })
    },
    openDeleteForm(id){
      this.selectedId = id
      this.confirm = true
    },
    loadImage(id){
      this.$q.loading.show()
      this.fStore.child('images/'+id+'.jpg').getDownloadURL().then((url)=>{
        this.imageUrl = url
        this.imagesDialog = true
        this.$q.loading.hide()
      }).catch((err)=>{
        this.$q.loading.hide()
        this.$q.notify({
          color: 'red-5',
          textColor: 'white',
          icon: 'error',
          message: "No Images Found"
        })

      })

    },
    rowClicked(evt,row,ind){
      this.clientState.getData('receipt/get/id/'+row._id).then((resp)=>{
        this.dataMode = 'edit'
        this.formData = this.form.createEditObject(this.form.receipt_form,resp)
        this.selectedId = row._id
        this.dialogOpened = true
      })
    },
    getWarehouse(){
      this.clientState.getData('receipt/get/'+(this.currentPage-1)).then((response)=>{
        this.itemData = response.data
        this.currentPage =response.currentPage
        this.totalPage = response.totalPage
      })
    },
    OpenAddDialog(){
      this.dataMode = 'add'
      this.formData = this.form.receipt_form
      this.dialogOpened = true
    },
    saveImage(id,imageBase){
      Loading.show()
      this.fStore.child('images/'+id+'.jpg').putString(imageBase, 'data_url').then((snapshot) => {
        console.log(snapshot)
        Loading.hide()
      })
    },
    saveData(data){
      if(this.dataMode === 'add'){
        let saveData = this.form.createPostObject(data)
        let imageBase = saveData["image"]
        delete saveData["image"]
        this.clientState.postData('receipt',saveData,'Receipt Added').then((resp)=>{
          this.saveImage(resp._id,imageBase)
          this.getWarehouse()
          this.dialogOpened = false
        })
      }
      else if(this.dataMode === 'edit') {
        let saveData = this.form.createPostObject(data)
        this.clientState.putData('receipt/edit/'+this.selectedId,saveData,'Receipt Updated').then(()=>{
          this.getWarehouse()
          this.dialogOpened = false
        })
      }
    }
  },
  created(){
    this.getWarehouse()
  }
}
</script>
