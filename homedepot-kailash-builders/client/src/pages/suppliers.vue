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
          <q-toolbar-title>Group Details</q-toolbar-title>
          <q-btn @click="editGroup" icon="edit" v-close-popup flat></q-btn>
          <q-btn icon="close" v-close-popup flat></q-btn>
        </q-toolbar>
        <q-card-section>
          <div class="row justify-center q-pt-md">
            <div class="col-lg-8 col-md-9 col-sm-11 col-xs-12 pa-2 text-body1">
              <div v-if="selectedData" class="row">
                <div class="col-12">
                  <b>Name: </b>{{selectedData.name}}
                </div>
                <div v-if="selectedData.email" class="col-12 q-pt-md">
                  <b>Email: </b>{{selectedData.email}}
                </div>
                <div v-if="selectedData.website" class="col-12 q-pt-md">
                  <b>Website: </b>{{selectedData.website}}
                </div>
                <div v-if="selectedData.city" class="col-12 q-pt-md">
                  <b>City: </b>{{selectedData.city}}
                </div>
                <div v-if="selectedData.state" class="col-12 q-pt-md">
                  <b>State: </b>{{selectedData.state}}
                </div>
                <div v-if="selectedData.street" class="col-12 q-pt-md">
                  <b>Street: </b>{{selectedData.street}}
                </div>
                <div v-if="selectedData.suburb" class="col-12 q-pt-md">
                  <b>Suburb: </b>{{selectedData.suburb}}
                </div>
                <div v-if="selectedData.country" class="col-12 q-pt-md">
                  <b>Country: </b>{{selectedData.country}}
                </div>
                <div v-if="selectedData.total_spent" class="col-12 q-pt-md">
                  <b>Total Spent: </b>Rs.{{selectedData.total_spent}}
                </div>
                <div class="col-12 q-pt-md">
                  <b>Created At: </b>{{selectedData.created_at.substring(0,10)}}
                </div>
                <div class="col-12 q-pt-lg">
                  <q-tabs
                    v-model="itemDetailsTab"
                    narrow-indicator
                    outside-arrows
                    mobile-arrows
                    style="min-height: 60px" class="text-primary q-mt-sm bg-grey-3 text-body1 rounded-borders"
                  >
                    <q-tab style="font-size: small" name="inventory_history" label="Inventory History" />
                    <q-tab name="past_history" label="Past History" />
                  </q-tabs>
                  <q-tab-panels
                    v-model="itemDetailsTab"
                    animated
                    vertical
                    transition-prev="jump-up"
                    transition-next="jump-up"
                  >
                    <q-tab-panel name="inventory_history">
                      <div v-if="inventoryHistory" class="row">
                        <div class="col-12">
                          <HistoryViewerComponent :datas="inventoryHistory"></HistoryViewerComponent>
                        </div>
                        <div class="col-12 q-pt-lg">
                          <div class="centerize">
                            <q-pagination
                              v-model="inventoryCurrentPage"
                              :max="inventoryTotalPage"
                              :max-pages="5"
                              :ellipses="false"
                              :boundary-numbers="false"
                              @click="getInventoryHistory"
                            />
                          </div>
                        </div>
                      </div>
                    </q-tab-panel>
                    <q-tab-panel name="past_history">
                      <div class="col-12 q-pt-xl" v-if="selectedData.paid_history">
                        <div class="q-pb-md text-h5 text-bold">Past History</div>
                        <div class="row">
                          <div :key="history._id" v-for="history in selectedData.paid_history" class="col-12">
                            <q-card>
                              <q-card-section class="text-body1">
                                <div>
                                  <b>Amount: </b>Rs.{{history.amount}}
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
                          <div class="col-12 q-py-lg text-center text-h5 text-bold font-bold" v-if="selectedData.paid_history.length<=0">
                            No Supplier History Found
                          </div>
                        </div>
                      </div>
                    </q-tab-panel>
                  </q-tab-panels>
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
          <q-toolbar-title>{{this.dataMode==='add'?"Add New Supplier":"Edit Supplier"}}</q-toolbar-title>
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
        <q-input :style="$props.isMobileView?'':'min-width: 50%;max-width: 50%'" v-model="search" label="Search For Suppliers" outlined class="shadow-1"></q-input>
      </div>
      <div class="col-lg-6 col-md-6 col-sm-12 col-xs-12">
        <div :class="$props.isMobileView?'q-pt-md':'text-right'">
          <q-btn label="Search" color="primary"></q-btn>
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
import HistoryViewerComponent from "components/HistoryViewerComponent";
export default {
  components: {HistoryViewerComponent},
  props:['isMobileView'],
  data(){
    return{
      mainDialog:false,
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
        { name: 'City', align: 'center', label: 'City', field: row => row.city, sortable: true },
        { name: 'Street', align: 'center', label: 'Street', field: 'street', sortable: true },
        { name: 'Mobile No', align: 'center', label: 'Mobile No', field: 'phone', sortable: true },
        { name: 'Total Spent', align: 'center', label: 'Total Spent', field: row=>'Rs. '+row.total_spent, sortable: true },
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
      inventoryCurrentPage:1,
      inventoryTotalPage:1,
      inventoryHistory:null,
      itemDetailsTab:"inventory_history",
    }
  },
  methods:{
    rowClicked(evt,row,ind){
      this.dataMode = 'edit'
      this.selectedData = row
      this.selectedId = row._id
      this.getInventoryHistory()
    },
    getInventoryHistory(){
      this.clientState.getData('supplier/history/'+this.selectedId+'/page/'+(this.inventoryCurrentPage-1)).then((resp)=>{
        this.inventoryHistory = resp.data
        this.inventoryCurrentPage = resp.currentPage
        this.inventoryTotalPage = resp.totalPage
        this.mainDialog = true
      })
    },
    editGroup(){
      this.formData = this.form.createEditObject(this.form.supplier_form,this.selectedData)
      this.dialogOpened = true
    },
    getWarehouse(){
      this.clientState.getData('supplier/get').then((response)=>{
        this.itemData = response
      })
    },
    OpenAddDialog(){
      this.dataMode = 'add'
      this.formData = this.form.supplier_form
      this.dialogOpened = true
    },
    saveData(data){
      if(this.dataMode === 'add'){
        let saveData = this.form.createPostObject(data)
        this.clientState.postData('supplier',saveData,'Group Added').then(()=>{
          this.getWarehouse()
          this.dialogOpened = false

        })
      }
      else if(this.dataMode === 'edit') {
        let saveData = this.form.createPostObject(data)
        this.clientState.putData('supplier/edit/'+this.selectedId,saveData,'Group Updated').then(()=>{
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
