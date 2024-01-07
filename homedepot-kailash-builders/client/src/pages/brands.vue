<template>
  <div class="q-pa-md">
    <q-dialog v-model="confirmDelete" persistent>
      <q-card>
        <q-card-section class="row items-center text-h6">
          <span class="q-ml-sm">Do you want to delete?</span>
        </q-card-section>

        <q-card-actions align="right">
          <q-btn flat label="Cancel" color="red-10" v-close-popup />
          <q-btn @click="deleteItem" flat label="Yes" color="primary" v-close-popup />
        </q-card-actions>
      </q-card>
    </q-dialog>
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
    <q-dialog
      maximized
      transition-show="slide-up"
      transition-hide="slide-down"
      v-model="dialogOpened">
      <q-card>
        <q-toolbar class="bg-primary text-white text-bold q-pa-md">
          <q-toolbar-title>Add New Brand</q-toolbar-title>
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
        <q-input :style="$props.isMobileView?'':'min-width: 50%;max-width: 50%'" v-model="search" label="Search For Brands" outlined class="shadow-1"></q-input>
      </div>
      <div class="col-lg-6 col-md-6 col-sm-12 col-xs-12">
        <div :class="$props.isMobileView?'q-pt-md':'text-right'">
          <q-btn @click="search" label="Search" color="primary"></q-btn>
        </div>
      </div>
      <div class="col-12 q-pt-lg">
        <q-table
          :pagination="{rowsPerPage:0}"
          :grid="$props.isMobileView"
          :data="itemData"
          :columns="warehouseColumn"
          row-key="name"
          :filter="search"
          hide-bottom
          @row-click="rowClicked"
          :hide-header="$props.isMobileView"
          card-class="text-body1 font-medium"
        >
          <template v-slot:body-cell="props">
            <q-td :props="props">
              <div class="q-py-lg">
                {{props.value}}
              </div>
            </q-td>
          </template>
        </q-table>
      </div>
      <div class="col-12 q-py-lg text-center text-h5 text-bold font-bold" v-if="itemData.length<=0">
        No Data Added Yet.
      </div>
    </div>
  </div>
</template>
<script>
import client from "../api/Client";
import FormData from "../api/formData";
export default {
  props:['isMobileView'],
  data(){
    return{
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
      ],
      dataMode:'add',
      selectedId:'',
      api: client,
      formData:[],
      form: new FormData(),
      itemData:[],
      search:"",
      confirmDelete:false
    }
  },
  methods:{
    deleteItem(){
      this.api.putData('brand/delete/'+this.selectedId,{},"Brand Deleted").then((resp)=>{
        this.getItem()
      })
    },
    rowClicked(evt,row,ind){
      this.selectedId = row._id
      this.confirmDelete = true
    },
    getItem(){
      this.api.getData('brand/get').then((response)=>{
        this.itemData = response
      })
    },
    OpenAddDialog(){
      this.dataMode = 'add'
      this.formData = this.form.brand_form
      this.dialogOpened = true
    },
    saveData(data){
      if(this.dataMode === 'add'){
        let saveData = this.form.createPostObject(data)
        this.api.postData('brand',saveData,'Brand Added').then(()=>{
          this.getItem()
          this.dialogOpened = false

        })
      }
    }
  },
  created(){
    this.getItem()
  }
}
</script>
