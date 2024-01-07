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
          <q-toolbar-title>Machine Details</q-toolbar-title>
          <q-btn @click="EditMachine" icon="edit" v-close-popup flat></q-btn>
          <q-btn @click="deleteMachine" icon="delete" v-close-popup flat></q-btn>
          <q-btn icon="close" v-close-popup flat></q-btn>
        </q-toolbar>
        <q-card-section>
          <div class="row justify-center q-pt-md">
            <div class="col-lg-8 col-md-9 col-sm-11 col-xs-12 pa-2 text-body1">
              <div v-if="selectedData" class="row">
                <div class="col-12">
                  <b>Name: </b>{{selectedData.name}}
                </div>
                <div v-if="selectedData.vehicleNo" class="col-12 q-pt-md">
                  <b>Vehicle No: </b>{{selectedData.vehicleNo}}
                </div>
                <div class="col-12 q-pt-md">
                  <b>Created On: </b>{{selectedData.created_at.substring(0,10)}}
                </div>
                <div v-if="selectedData.amount_spent" class="col-12 q-pt-md">
                  <b>Total Spent: </b>Rs.{{selectedData.amount_spent}}
                </div>
                <div class="col-12 q-pt-md">
                  <b>Created At: </b>{{selectedData.created_at.substring(0,10)}}
                </div>
                <div class="col-12 q-pt-xl" v-if="selectedData.salesHistory">
                  <div class="q-pb-md text-h5 text-bold">Past History</div>
                  <div class="row">
                    <div :key="history._id" v-for="history in selectedData.salesHistory" class="col-12 q-pa-xs">
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
                          <div v-if="history.note && history.note !== ''">
                            <b>Note: </b>{{history.note}}
                          </div>
                        </q-card-section>
                      </q-card>
                    </div>
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
          <q-toolbar-title>Add New Machine</q-toolbar-title>
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
        <q-input :style="$props.mobileView?'':'min-width: 50%;max-width: 50%'" v-model="search" label="Search For Machines" outlined class="shadow-1"></q-input>
      </div>
      <div class="col-lg-6 col-md-6 col-sm-12 col-xs-12">
        <div :class="$props.mobileView?'q-pt-md':'text-right'">
          <q-btn label="Search" color="primary"></q-btn>
        </div>
      </div>
      <div class="col-12 q-pt-lg">
        <q-table
          :pagination="{rowsPerPage:0}"
          :grid="$props.mobileView"
          :data="itemData"
          :columns="warehouseColumn"
          :filter="search"
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
          field: row => row.name,
          sortable: true
        },
        { name: 'Vehicle No', align: 'center', label: 'Vehicle No', field: row => row.vehicleNo, sortable: true },
        { name: 'Amount Spent', align: 'center', label: 'Amount Spent', field: row => row.amount_spent, sortable: true },
        { name: 'Created On', align: 'center', label: 'Created On', field: row => row.created_at.substring(0,10), sortable: true },

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
      mainDialog:false,
      selectedData:null
    }
  },
  methods:{
    EditMachine(){
      this.clientState.getData('machine/id/'+this.selectedId).then((resp)=>{
        this.dataMode = 'edit'
        this.formData = this.form.createEditObject(this.form.machine_form,resp)
        this.dialogOpened = true
      })
    },
    deleteMachine(){
      this.clientState.putData('machine/delete/'+this.selectedId,{},"Vehicle Deleted").then(()=>{
        this.getWarehouse()
      })
    },
    rowClicked(evt,row,ind){
      this.selectedData = row
      this.selectedId = row._id
      this.mainDialog = true
    },
    getWarehouse(){
      this.clientState.getData('machine/get').then((response)=>{
        console.log(response)
        this.itemData = response
      })
    },
    OpenAddDialog(){
      this.dataMode = 'add'
      this.formData = this.form.machine_form
      this.dialogOpened = true
    },
    saveData(data){
      if(this.dataMode === 'add'){
        let saveData = this.form.createPostObject(data)
        this.clientState.postData('machine',saveData,'Machine Added').then(()=>{
          this.getWarehouse()
          this.dialogOpened = false

        })
      }
      else if(this.dataMode === 'edit') {
        let saveData = this.form.createPostObject(data)
        this.clientState.putData('machine/edit/'+this.selectedId,saveData,'Machine Updated').then(()=>{
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
