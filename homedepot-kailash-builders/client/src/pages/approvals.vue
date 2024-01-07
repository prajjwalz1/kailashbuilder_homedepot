<template>
  <div class="q-pa-md">
    <q-dialog v-model="confirm" persistent>
      <q-card>
        <q-card-section class="row items-center">
          <q-avatar icon="task_alt" color="primary" text-color="white" />
          <span class="q-ml-sm">Are You Sure You Want To Approve?</span>
        </q-card-section>

        <q-card-actions align="right">
          <q-btn flat label="Cancel" color="primary" v-close-popup />
          <q-btn @click="approvePass" flat label="Yes" color="primary" />
        </q-card-actions>
      </q-card>
    </q-dialog>
    <div style="min-height: 100%;max-height: 100%" class="row">
      <div class="col-lg-6 col-md-6 col-sm-12 col-xs-12">
        <q-input :style="$props.mobileView?'':'min-width: 50%;max-width: 50%'" v-model="search" label="Search For Approvals" outlined class="shadow-1"></q-input>
      </div>
      <div class="col-lg-6 col-md-6 col-sm-12 col-xs-12 q-pb-lg">
        <div :class="$props.mobileView?'q-pt-md':'text-right'">
          <q-btn label="Search" color="primary"></q-btn>
        </div>
      </div>
      <div :key="ind" v-for="(item,ind) in itemData" class="col-12 q-pa-xs">
        <q-list bordered class="rounded-borders q-pa-sm text-body2">
          <q-item-label header>{{computeType(item.type)}}</q-item-label>
          <q-item>
            <q-item-section avatar top>
              <q-icon :name="computeIcon(item.type)" :color="computeColor(item.type)" size="34px" />
            </q-item-section>
            <q-item-section top>
              <q-item-label v-if="item.type==='transfer'" class="ellipsis q-pb-xs text-bold text-h6" >
                {{getItemStart(item)}}<q-icon class="q-pr-md q-pl-md" color="red-10" size="xl" name="east"></q-icon>{{getItemEnd(item)}}
              </q-item-label>
              <q-item-label v-if="item.product_id" class="ellipsis q-pb-xs" >
                <b>Name: {{ item.product_id.name }}</b>
              </q-item-label>
              <q-item-label v-if="item.warehouse_start" class="q-pt-xs q-pb-xs" >
                <b>{{item.type==='transfer'?'Transfer Start ':''}}Warehouse: </b> {{item.warehouse_start.name}}
              </q-item-label>
              <q-item-label v-if="item.group_start" class="q-pt-xs q-pb-xs" >
                <b>{{item.type==='transfer'?'Transfer Start ':''}}Group: </b> {{item.group_start.name}}
              </q-item-label>
              <q-item-label v-if="item.site_start" class="q-pt-xs q-pb-xs" >
                <b>{{item.type==='transfer'?'Transfer Start ':''}}Site: </b> {{item.site_start.name}}
              </q-item-label>
              <q-item-label v-if="item.warehouse_end" class="q-pt-xs q-pb-xs" >
                <b>Destination Warehouse: </b> {{item.warehouse_end.name}}
              </q-item-label>
              <q-item-label v-if="item.group_end" class="q-pt-xs q-pb-xs" >
                <b>Destination Group: </b> {{item.group_end.name}}
              </q-item-label>
              <q-item-label v-if="item.site_end " class="q-pt-xs q-pb-xs" >
                <b>Destination Site: </b> {{item.site_end.name}}
              </q-item-label>
              <q-item-label v-if="item.supplier && item.type==='update'" class="q-pt-xs q-pb-xs" >
                <b>Supplier: </b> {{item.supplier.name}}
              </q-item-label>
              <q-item-label v-if="item.group && item.type==='group'" class="q-pt-xs q-pb-xs" >
                <b>Group: </b> {{item.group.name}}
              </q-item-label>
              <q-item-label v-if="item.machine && item.type==='machine'" class="q-pt-xs q-pb-xs" >
                <b>Machine: </b> {{item.machine.name}}
              </q-item-label>
              <q-item-label v-if="item.product_id" class="q-pt-xs q-pb-xs" >
                <b>{{item.type==='update'?'Added':'Transferred'}} Stock : </b> {{item.stock_count}}
              </q-item-label>
              <q-item-label v-if="item.retail_price && item.retail_price !== ''" class="q-pt-xs q-pb-xs" >
                <b>Retail Price : </b> Rs. {{item.retail_price}}
              </q-item-label>
              <q-item-label class="q-pt-xs q-pb-xs" >
                <b>Total Price : </b> Rs. {{item.total_price}}
              </q-item-label>
              <q-item-label v-if="item.added_by" class="q-pt-xs q-pb-xs" >
                <b>Issued By : </b> {{item.added_by}}
              </q-item-label>
              <q-item-label v-if="item.type === 'transfer'" class="q-pt-xs q-pb-md" >
                <b>Status : </b>
                <q-btn-dropdown outline :color="item.status?item.status === 'Received'?'green-10':'red-10':'red-10'" class="q-ml-sm text-bold" :label="item.status?item.status:'Not Received'" >
                  <q-list>
                    <q-item clickable v-close-popup @click="setStatusUpdate(item._id,'Received')">
                      <q-item-section>
                        <q-item-label>Received</q-item-label>
                      </q-item-section>
                    </q-item>
                    <q-item clickable v-close-popup @click="setStatusUpdate(item._id,'Not Received')">
                      <q-item-section>
                        <q-item-label>Not Received</q-item-label>
                      </q-item-section>
                    </q-item>
                  </q-list>
                </q-btn-dropdown>
              </q-item-label>
              <q-item-label class="text-body2 text-weight-bold text-primary text-uppercase">
                <q-btn class="q-mt-sm q-mb-xs" @click="openYesDialog(item._id,'approve')" color="primary" rounded :label="item.type==='update'?'Approve Update':'Approve Transfer'"></q-btn>
                <q-btn color="red-10" class="q-mt-sm q-ml-sm q-mb-xs" @click="openYesDialog(item._id,'delete')"  rounded label="Delete"></q-btn>
              </q-item-label>
            </q-item-section>
          </q-item>
        </q-list>
      </div>
      <div class="col-12 q-py-lg text-center text-h5 text-bold font-bold" v-if="itemData.length<=0">
        No Data Remaining Approvals.
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
        { name: 'City', align: 'center', label: 'City', field: row => row.city, sortable: true },
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
      confirm:false,
      selectType:"approve"
    }
  },
  methods:{
    setStatusUpdate(id,status){
      this.clientState.putData('approval/id/'+id+'/status/'+status,{},"Status Updated").then(()=>{
        this.getData()
      })
    },
    getItemStart(item){
      if(item.warehouse_start){
        return 'Warehouse'
      }
      else if(item.group_start){
        return 'Group'
      }
      else if(item.site_start){
        return 'Site'
      }
    },
    getItemEnd(item){
      if(item.warehouse_end){
        return 'Warehouse'
      }
      else if(item.group_end){
        return 'Group'
      }
      else if(item.site_end){
        return 'Site'
      }
    },
    computeType(type){
      if(type==='update'){
        return 'Product Update'
      }
      else if(type==='transfer'){
        return 'Transfer Product'
      }
      else if(type==='group'){
        return 'Group Sales'
      }
      else if(type==='machine'){
        return 'Machine Sales'
      }
    },
    computeIcon(type){
      if(type==='update'){
        return 'library_add'
      }
      else if(type==='transfer'){
        return 'transfer_within_a_station'
      }
      else if(type==='group'){
        return 'history'
      }
      else if(type==='machine'){
        return 'history'
      }
    },
    computeColor(type){
      if(type==='update'){
        return 'orange-10'
      }
      else if(type==='transfer'){
        return 'red-10'
      }
      else if(type==='group'){
        return 'green-10'
      }
      else if(type==='machine'){
        return 'green-10'
      }
    },
    approvePass(){
      if(this.selectType === 'approve'){
        this.clientState.putData('approve/'+this.selectedId,{},"Pass Approved").then((req)=>{
          this.confirm = false
          this.getData()
        })
      }
      else if(this.selectType === 'delete'){
        this.clientState.putData('approval/delete/'+this.selectedId,{},"Pass Deleted").then((req)=>{
          this.confirm = false
          this.getData()
        })
      }

    },
    openYesDialog(id,type){
      this.selectType = type
      this.selectedId = id
      this.confirm = true
    },
    getData(){
      this.clientState.getData('approval/get').then((response)=>{
        console.log(response)
        this.itemData = response
      })
    },
  },
  created(){
    this.getData()
  }
}
</script>
