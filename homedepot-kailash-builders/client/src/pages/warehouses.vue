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
    <q-dialog v-model="confirmDeleteDialog" persistent>
      <q-card>
        <q-card-section class="row items-center">
          <q-avatar icon="task_alt" color="primary" text-color="white" />
          <span class="q-ml-sm">Are You Sure You Want To Delete?</span>
        </q-card-section>

        <q-card-actions align="right">
          <q-btn v-if="dataMode==='edit'" v-close-popup @click="deleteWarehouse" flat label="Yes" color="primary" />
          <q-btn flat label="Cancel" color="primary" v-close-popup />
        </q-card-actions>
      </q-card>
    </q-dialog>
    <q-dialog
      maximized
      transition-show="slide-up"
      transition-hide="slide-down"
      v-model="dialogOpened">
      <q-card>
        <q-toolbar class="bg-primary text-white text-bold q-pa-md">
          <q-toolbar-title>Add New Warehouse</q-toolbar-title>
          <q-btn flat v-close-popup icon="delete" @click="confirmDeleteDialog = true"></q-btn>
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
    <q-dialog
      maximized
      transition-show="slide-up"
      transition-hide="slide-down"
      v-model="mainDialog">
      <q-card>
        <q-toolbar class="bg-primary text-white text-bold q-pa-md">
          <q-toolbar-title>Group Details</q-toolbar-title>
          <q-btn @click="confirmDeleteDialog = true" icon="delete" v-close-popup flat></q-btn>
          <q-btn @click="editSite" icon="edit" v-close-popup flat></q-btn>
          <q-btn icon="close" v-close-popup flat></q-btn>
        </q-toolbar>
        <q-card-section>
          <div class="row justify-center q-pt-md">
            <div class="col-lg-8 col-md-9 col-sm-11 col-xs-12 pa-2 text-body1">
              <div v-if="selectedData" class="row">
                <div class="col-12">
                  <b>Name: </b>{{selectedData.name}}
                </div>
                <div v-if="selectedData.city" class="col-12 q-pt-md">
                  <b>City: </b>{{selectedData.city}}
                </div>
                <div v-if="selectedData.street" class="col-12 q-pt-md">
                  <b>Street: </b>{{selectedData.street}}
                </div>
                <div v-if="selectedData.starting_date" class="col-12 q-pt-md">
                  <b>Starting Date: </b>{{selectedData.starting_date.substring(0,10)}}
                </div>
                <div v-if="selectedData.estimated_completion_date" class="col-12 q-pt-md">
                  <b>Estimated Completion Date: </b>{{selectedData.estimated_completion_date.substring(0,10)}}
                </div>
                <div v-if="selectedData.allocated_budget" class="col-12 q-pt-md">
                  <b>Allocated Budget: </b>{{selectedData.allocated_budget}}
                </div>
                <div v-if="selectedData.total_amount" class="col-12 q-pt-md">
                  <b>Total Spent: </b>Rs.{{selectedData.total_amount}}
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
                  </q-tab-panels>
                </div>
              </div>
            </div>
          </div>
        </q-card-section>
      </q-card>
    </q-dialog>
    <div style="min-height: 100%;max-height: 100%" class="row">
      <div class="col-lg-6 col-md-6 col-sm-12 col-xs-12">
        <q-input :style="$props.mobileView?'':'min-width: 50%;max-width: 50%'" v-model="search" label="Search For Item" outlined class="shadow-1"></q-input>
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
import HistoryViewerComponent from "components/HistoryViewerComponent";
export default {
  components: {HistoryViewerComponent},
  props:['mobileView'],
  data(){
    return{
      confirmDeleteDialog:false,
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
        { name: 'Owner', align: 'center', label: 'Owner', field: row => row.warehouse_owner.full_name, sortable: true },
        { name: 'City', align: 'center', label: 'City', field: 'city', sortable: true },
        { name: 'Street', align: 'center', label: 'Street', field: 'street', sortable: true },
        { name: 'Mobile No', align: 'center', label: 'Mobile No', field: 'mobile_number', sortable: true },
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
      inventoryCurrentPage:1,
      inventoryTotalPage:1,
      inventoryHistory:null,
      itemDetailsTab:"inventory_history",
      mainDialog:false,
      selectedData:null
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
      this.clientState.getData('warehouse/history/'+this.selectedId+'/page/'+(this.inventoryCurrentPage-1)).then((resp)=>{
        this.inventoryHistory = resp.data
        this.inventoryCurrentPage = resp.currentPage
        this.inventoryTotalPage = resp.totalPage
        this.mainDialog = true
      })
    },
    editSite(){
      this.clientState.getData('warehouse/get/id/'+this.selectedId).then((resp)=>{
        this.dataMode = 'edit'
        this.formData = this.form.createEditObject(this.form.warehouse_form,resp)
        this.dialogOpened = true
      })
    },
    deleteWarehouse(){
      this.clientState.putData('warehouse/delete/'+this.selectedId,{},"Warehouse Deleted").then(()=>{
        this.getWarehouse()
      })
    },
    searchWarehouse(){
      this.clientState.getData('warehouse/search/'+this.search).then((response)=>{
        this.itemData = response.data
        this.currentPage = response.currentPage
        this.totalPage = response.totalPage
      })
    },
    getWarehouse(){
      this.clientState.getData('warehouse/get/'+(this.currentPage-1)).then((response)=>{
        this.itemData = response.data
        this.currentPage = response.currentPage
        this.totalPage = response.totalPage
      })
    },
    OpenAddDialog(){
      this.dataMode = 'add'
      this.formData = this.form.warehouse_form
      this.dialogOpened = true
    },
    saveData(data){
      if(this.dataMode === 'add'){
        let saveData = this.form.createPostObject(data)
        this.clientState.postData('warehouse',saveData,'Warehouse Added').then(()=>{
          this.getWarehouse()
          this.dialogOpened = false

        })
      }
      else if(this.dataMode === 'edit') {
        let saveData = this.form.createPostObject(data)
        this.clientState.putData('warehouse/edit/'+this.selectedId,saveData,'Warehouse Updated').then(()=>{
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
