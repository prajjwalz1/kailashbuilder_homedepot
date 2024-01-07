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
    <q-dialog
      maximized
      transition-show="slide-up"
      transition-hide="slide-down"
      v-model="mainDialog">
      <q-card>
        <q-toolbar class="bg-primary text-white text-bold q-pa-md">
          <q-toolbar-title>User Details</q-toolbar-title>
          <q-btn @click="EditUser" icon="edit" v-close-popup flat></q-btn>
          <q-btn @click="DeleteUser" icon="delete" v-close-popup flat></q-btn>
          <q-btn icon="close" v-close-popup flat></q-btn>
        </q-toolbar>
        <q-card-section>
          <div class="row justify-center">
            <div v-if="selectedData" class="col-lg-8 col-md-9 col-sm-11 col-xs-12 pa-2 text-body1">
              <div class="col-12" v-if="selectedData.salary_history">
                <div class="q-pb-md text-h5 text-bold">Past History</div>
                <div v-if="selectedData.salary_history.length <=0">No History Found</div>
                <div class="row">
                  <div :key="history._id" v-for="history in selectedData.salary_history" class="col-12 q-pa-sm">
                    <q-card>
                      <q-card-section class="text-body1">
                        <div>
                          <b>Amount: </b>Rs.{{history.amount_given}}
                        </div>
                        <div>
                          <b>Added On: </b>{{history.added_on.substring(0,10)}}
                        </div>
                        <div>
                          <b>Added By: </b>{{history.added_by.full_name}}
                        </div>
                        <div v-if="history.paymentType && history.paymentType !== ''">
                          <b>Payment Method: </b>{{history.paymentType}}
                        </div>
                        <div v-if="history.chequeNo && history.chequeNo !== ''">
                          <b>Cheque No: </b>{{history.chequeNo}}
                        </div>
                        <div v-if="history.reason && history.reason !== ''">
                          <b>Note: </b>{{history.reason}}
                        </div>
                      </q-card-section>
                    </q-card>
                  </div>
                </div>
              </div>
            </div>
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
          <q-toolbar-title>Add New Staff</q-toolbar-title>
          <q-btn icon="close" v-close-popup flat></q-btn>
        </q-toolbar>
        <q-card-section>
          <div class="row justify-center q-pt-md">
            <div class="col-lg-8 col-md-9 col-sm-11 col-xs-12 pa-2">
              <div class="row">
                <div class="col-12">
                  <simple-form-renderer :mobView="$props.mobileView" @dataSaved="saveData" @closeDialog="dialogOpened = false" :form-details="formData"></simple-form-renderer>
                </div>
              </div>
            </div>
          </div>
        </q-card-section>
      </q-card>
    </q-dialog>
    <div style="min-height: 100%;max-height: 100%" class="row">
      <div class="col-lg-6 col-md-6 col-sm-12 col-xs-12">
        <q-input :style="$props.mobileView?'':'min-width: 50%;max-width: 50%'" v-model="search" label="Search For Staffs" outlined class="shadow-1"></q-input>
      </div>
      <div class="col-lg-6 col-md-6 col-sm-12 col-xs-12">
        <div :class="$props.mobileView?'q-pt-md':'text-right'">
          <q-btn @click="searchWarehouse" label="Search" color="primary"></q-btn>
        </div>
      </div>
      <div class="col-12 q-pt-lg">
        <q-table
          :pagination="{rowsPerPage:0}"
          :grid="$props.mobileView"
          :data="itemData"
          :columns="warehouseColumn"
          row-key="name"
          hide-bottom
          @row-click="rowClicked"
          :hide-header="$props.mobileView"
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
export default {
  props:['mobileView'],
  data(){
    return{
      dialogOpened:false,
      warehouseColumn:[
        {
          name: 'desc',
          required: true,
          label: 'Name',
          align: 'left',
          field: row => row.full_name,
          sortable: true
        },
        { name: 'email', align: 'center', label: 'Email', field: row => row.email, sortable: true },
        { name: 'warehouse', align: 'center', label: 'Warehouse', field: row => row.warehouse?row.warehouse.name:'Not Associated', sortable: true },
        { name: 'gender', align: 'center', label: 'Gender', field: 'gender', sortable: true },
        { name: 'salary_start_date', align: 'center', label: 'Salary Paid Till', field: row => row.salary_start_date?row.salary_start_date.substring(0,10):'Not Added', sortable: true },
        { name: 'next_salary_date', align: 'center', label: 'Next Salary Date', field: row => row.next_salary_date?row.next_salary_date.substring(0,10):'Not Added', sortable: true },
        { name: 'total_spent', align: 'center', label: 'Total Salary Paid', field: row => row.total_spent?row.total_spent:'Not Added', sortable: true },
        { name: 'city', align: 'center', label: 'City', field: row => row.user_contact?row.user_contact.city:'Not Added', sortable: true },
        { name: 'mobile_number', align: 'center', label: 'Mobile No', field: row => row.user_contact?row.user_contact.mobile_number:'Not Added', sortable: true },
      ],
      dataMode:'add',
      selectedId:'',
      currentPage:1,
      totalPage:1,
      clientState: client,
      formData:[],
      form: new FormData(),
      itemData:[],
      search:"",
      selectedData:null,
      mainDialog:false
    }
  },
  methods:{
    EditUser(){
      this.clientState.getData('user/id/'+this.selectedId,"User Updated").then((resp)=>{
        this.dataMode = 'edit'
        this.formData = this.form.createEditObject(this.form.user_form,resp)
        this.dialogOpened = true
      })
    },
    DeleteUser(){
      this.clientState.putData('user/delete/'+this.selectedId,{},"User Deleted").then(()=>{
        this.getWarehouse()
      })
    },
    rowClicked(evt,row,ind){
      this.selectedData = row
      this.selectedId = row._id
      this.mainDialog = true

    },
    searchWarehouse(){
      this.clientState.getData('user/search/'+this.search).then((response)=>{
        this.itemData = response
      })
    },
    getWarehouse(){
      this.clientState.getData('user/get/').then((response)=>{
        this.itemData = response
      })
    },
    OpenAddDialog(){
      this.dataMode = 'add'
      this.formData = this.form.user_form
      this.dialogOpened = true
    },
    saveData(data){
      if(this.dataMode === 'add'){
        let saveData = this.form.createPostObject(data)
        this.clientState.postData('user',saveData,'Staff Added').then(()=>{
          this.getWarehouse()
          this.dialogOpened = false

        })
      }
      else if(this.dataMode === 'edit') {
        let saveData = this.form.createPostObject(data)
        this.clientState.putData('user/edit/'+this.selectedId,saveData,'User Updated').then(()=>{
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
