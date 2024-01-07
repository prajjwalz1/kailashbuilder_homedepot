<template>
  <div class="q-pa-md">
    <q-page-sticky style="z-index: 10"  position="bottom-right" :offset="[18, 18]">
      <q-fab
        icon="add"
        @click="openAddDialog"
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
      v-model="openSalesAddDialog">
      <q-card>
        <q-toolbar class="bg-primary text-white text-bold q-pa-md">
          <q-toolbar-title>{{this.mode==='add'?'New Sales Add':'Edit Sales'}}</q-toolbar-title>
          <q-btn icon="close" v-close-popup flat></q-btn>
        </q-toolbar>
        <q-card-section>
          <div class="row justify-center">
            <div class="col-lg-8 col-md-9 col-sm-11 col-xs-12 pa-2">
              <div class="row">
                <div class="col-lg-4 col-md-6 col-sm-6 col-xs-12 q-py-md">
                  <b>Invoice Date</b>
                  <q-input filled class="shadow-1" type="date" solo v-model="invoice_date" ></q-input>
                </div>
                <q-card :key="ind" v-for="(sale,ind) in sales" class="col-12 q-my-md">
                  <q-card-section>
                    <div class="row">
                      <div class="col-12 ">
                        <div class="row">
                          <div class="col-8 q-pa-sm text-h6 font-weight-bold">
                            Sales No {{ind+1}}
                          </div>
                          <div class="col-4 q-pa-sm text-right">
                            <q-btn @click="RemoveService(ind)" round push size="sm" icon="close" color="red-10"></q-btn>
                          </div>
                        </div>
                      </div>
                      <div class="col-lg-4 col-md-6 col-sm-6 col-xs-12 q-pa-sm">
                        <div v-if="sale.onModel==='product'">
                          <b>Product</b>
                          <query-search-renderer @selectQuery="prodSelected($event,sale)" :details="sale.item" type="product_search"></query-search-renderer>
                        </div>
                        <div v-if="sale.onModel==='machine'">
                          <b>Machine</b>
                          <query-search-renderer @selectQuery="machineSelected($event,sale)" :details="sale.item" type="machine_search"></query-search-renderer>
                        </div>
                        <div v-if="sale.onModel==='staffs'">
                          <b>Staffs</b>
                          <query-search-renderer @selectQuery="staffSelected($event,sale)" :details="sale.item" type="user_search"></query-search-renderer>
                        </div>
                        <div v-if="sale.onModel==='group'">
                          <b>Group</b>
                          <query-search-renderer @selectQuery="groupSelected($event,sale)" :details="sale.item" type="group_search"></query-search-renderer>
                        </div>
                        <div v-if="sale.onModel==='supplier'">
                          <b>Supplier</b>
                          <query-search-renderer @selectQuery="groupSelected($event,sale)" :details="sale.item" type="supplier_search"></query-search-renderer>
                        </div>
                      </div>
                      <div class="col-lg-4 col-md-6 col-sm-6 col-xs-12 q-pa-sm" v-if="sale.onModel==='product'">
                        <b>Warehouse</b>
                        <q-select
                          class="shadow-1"
                          filled
                          v-model="sale.warehouse"
                          option-label="label"
                          option-value="value"
                          use-input
                          @input="EmitWarehouseData(sale)"
                          input-debounce="100"
                          label="Select Warehouse"
                          :options="warehouseOptions"
                          @filter="filterFn"
                          behavior="menu"
                        >
                          <template v-slot:no-option>
                            <q-item>
                              <q-item-section class="text-grey">
                                No results
                              </q-item-section>
                            </q-item>
                          </template>
                        </q-select>
                      </div>
                      <div class="col-lg-4 col-md-6 col-sm-6 col-xs-12 q-pt-sm q-pa-sm" v-if="sale.onModel==='staffs'">
                        <b>Select Payment Type</b>
                        <q-select label="Select Payment Type" filled class="shadow-1" :options="['Salary','Others']" v-model="sale.type"></q-select>
                      </div>
                      <div class="col-lg-4 col-md-6 col-sm-6 col-xs-12 q-pt-sm q-pa-sm" v-if="sale.onModel==='staffs' && sale.type === 'Salary'">
                        <b>Enter Months</b>
                        <q-input label="Months" type="number" filled class="shadow-1" v-model.number="sale.quantity"></q-input>
                      </div>
                      <div class="col-lg-4 col-md-6 col-sm-6 col-xs-12 q-pt-sm q-pa-sm" v-if="sale.onModel!=='product'">
                        <b>Select Payment Method</b>
                        <q-select label="Select Payment Method" filled class="shadow-1" :options="['Cheque','Cash']" v-model="sale.paymentType"></q-select>
                      </div>
                      <div class="col-lg-4 col-md-6 col-sm-6 col-xs-12 q-pt-sm q-pa-sm" v-if="sale.onModel!=='product' && sale.paymentType === 'Cheque'">
                        <b>Enter Cheque No</b>
                        <q-input label="Cheque No" filled class="shadow-1" v-model="sale.chequeNo"></q-input>
                      </div>
                      <div class="col-lg-4 col-md-6 col-sm-6 col-xs-12 q-pt-sm q-pa-sm" v-if="sale.onModel==='staffs' && sale.type === 'salary'">
                        <b>Enter Months</b>
                        <q-input label="Months" type="number" filled class="shadow-1" v-model.number="sale.quantity"></q-input>
                      </div>
                      <div v-if="sale.onModel==='product'" class="col-lg-4 col-md-6 col-sm-6 col-xs-12 q-pt-sm q-pa-sm">
                        <b>Enter Quantity</b>
                        <q-input filled class="shadow-1" @input="changeTotal(sale)" v-model.number="sale.quantity" solo type="number" label="Quantity"></q-input>
                        <div class="text-red q-pt-sm" v-if="sale.onModel==='product' && sale.warehouse">
                          {{sale.warehouse?'Total Stock Count in Selected Warehouse '+sale.warehouse.stock_count:''}}
                        </div>
                      </div>
                      <div class="col-lg-4 col-md-6 col-sm-6 col-xs-12 q-pa-sm">
                        <b>Price</b>
                        <q-input filled class="shadow-1" @input="changeTotal(sale)" v-model.number="sale.retail_price" solo type="number" label="Price"></q-input>
                      </div>
                      <div v-if="sale.onModel!=='group' && sale.onModel!=='supplier'" class="col-lg-4 col-md-6 col-sm-6 col-xs-12 q-pa-sm">
                        <b>Total</b>
                        <q-input filled class="shadow-1" v-model.number="sale.total" solo type="number" label="Total"></q-input>
                      </div>
                      <div v-if="sale.onModel!=='product'" class="col-lg-4 col-md-6 col-sm-6 col-xs-12 q-pa-sm">
                        <b>Note</b>
                        <q-input type="area" filled class="shadow-1" v-model.number="sale.note" solo label="Enter Note"></q-input>
                      </div>
                    </div>
                  </q-card-section>
                </q-card>
                <div v-if="sales.length>0" class="col-12 q-py-md">
                  <div class="mt-3 text-right text-h5 font-weight-bold">
                    Total Rs.{{calcTotalAmt}}
                  </div>
                </div>
                <div class="col-12 q-mt-md q-py-md">
                  <q-chip
                    clickable
                    color="primary"
                    class="q-mr-md"
                    style="cursor: pointer"
                    @click="AddNewProduct"
                    outlined
                    text-color="white"
                    label="Add Product"
                    icon="add"
                  >
                  </q-chip>

                  <q-chip
                    clickable
                    color="primary"
                    class="q-mr-md"
                    style="cursor: pointer"
                    @click="AddNewStaffs"
                    outlined
                    text-color="white"
                    label="Add Staffs"
                    icon="add"
                  >
                  </q-chip>

                  <q-chip
                    clickable
                    color="primary"
                    class="q-mr-md"
                    style="cursor: pointer"
                    @click="AddNewMachine"
                    outlined
                    text-color="white"
                    label="Add Machine"
                    icon="add"
                  >
                  </q-chip>
                  <q-chip
                    clickable
                    color="primary"
                    class="q-mr-md"
                    style="cursor: pointer"
                    @click="AddNewGroup"
                    outlined
                    text-color="white"
                    label="Add Groups"
                    icon="add"
                  >
                  </q-chip>
                  <q-chip
                    clickable
                    color="primary"
                    class="q-mr-md"
                    style="cursor: pointer"
                    @click="AddNewSupplier"
                    outlined
                    text-color="white"
                    label="Add Supplier"
                    icon="add"
                  >
                  </q-chip>
                </div>
                <div class="col-lg-4 col-md-6 col-sm-6 col-xs-12 q-py-md q-pr-md">
                  <b>Total Amount</b>
                  <q-input filled class="shadow-1" type="number" solo label="Total Amount" v-model="total_amount">
                  </q-input>
                </div>
                <div class="col-lg-4 col-md-6 col-sm-6 col-xs-12 q-py-md">
                  <b>Comments/Notes</b>
                  <q-input filled class="shadow-1"  type="area" solo label="Comments/Notes" v-model="comments">
                  </q-input>
                </div>
                <div class="col-12 q-pt-md">
                  <q-btn class="q-mr-md" @click="postSales" label="Save" color="primary"></q-btn>
                  <q-btn label="Cancel" @click="openSalesAddDialog = false" color="warning"></q-btn>
                </div>
              </div>
            </div>
          </div>
        </q-card-section>
      </q-card>
    </q-dialog>
    <div style="min-height: 100%;max-height: 100%" class="row">
      <div class="col-lg-6 col-md-6 col-sm-12 col-xs-12">
        <q-input :style="$props.isMobileView?'':'min-width: 50%;max-width: 50%'" v-model="search" label="Search For Item" outlined class="shadow-1"></q-input>
      </div>
      <div class="col-lg-6 col-md-6 col-sm-12 col-xs-12">
        <div :class="$props.isMobileView?'q-pt-md':'text-right'">
          <q-btn @click="searchServices" label="Search" color="primary"></q-btn>
        </div>
      </div>
      <div class="col-12 q-pt-lg">
        <q-list :key="ind" v-for="(item,ind) in salesData" bordered class="rounded-borders q-ma-xs">
          <q-item-label header>Sales</q-item-label>
          <q-item>
            <q-item-section avatar top>
              <q-icon name="paid" color="green-8" size="34px" />
            </q-item-section>
            <q-item-section top>
              <q-item-label class="ellipsis q-pt-sm" >
                <b>Invoice No: </b> {{ item.invoice_no }}
              </q-item-label>
              <q-item-label class="ellipsis q-pt-sm" >
                <b>Invoice Date: </b> {{ item.invoice_date.substring(0,10) }}
              </q-item-label>
              <q-item-label class="q-pt-sm" >
                <b>Total Amount: </b> Rs.{{item.total_amount}}
              </q-item-label>
              <q-item-label v-if="item.note && item.note !== ''" class="q-pt-sm q-pb-xs" >
                <b>Note : </b>{{item.note}}
              </q-item-label >
              <q-item-section class="q-pt-sm">
                <b>Items: </b>
                <ul class="q-pl-lg q-mt-sm">
                  <li class="q-pt-none" :key="ind" v-for="(sale,ind) in item.items">{{sale.item.label+ " x "+sale.quantity + " = Rs. "+sale.total}}</li>
                </ul>
              </q-item-section>
              <q-item-label class="text-body2 text-weight-bold text-primary text-uppercase">
                <q-btn class="q-mt-sm q-mb-xs" @click="OpenSalesInfo(item)" outline rounded label="View More Details"></q-btn>
              </q-item-label>
            </q-item-section>
          </q-item>
        </q-list>
      </div>
      <div class="col-12 q-pt-lg">
        <div class="centerize">
          <q-pagination
            v-model="currentPage"
            :max="totalPage"
            :max-pages="5"
            :ellipses="false"
            :boundary-numbers="false"
            @click="getSales"
          />
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import FormData from "../api/formData";
import client from "../api/Client";
import QuerySearchRenderer from '../components/QuerySearchRenderer.vue'

export default {
  props:['isMobileView'],
  components:{
    'query-search-renderer':QuerySearchRenderer
  },
  computed:{
    calcTotalAmt(){
      let total = 0
      for(let i=0;i<this.sales.length;i++){
        if(!this.sales[i].total){
          total += 0
        }
        else {
          total += parseInt(this.sales[i].total)
        }

      }
      this.total_amount = total
      return total
    }
  },
  data(){
    return{
      total_amount:0,
      warehouseOptions:[],
      comments:"",
      amount_paid:"",
      invoice_date:"",
      due_date:"",
      selectedClient:null,
      loading:false,
      searchName:"",
      openSalesAddDialog:false,
      clientHeaders:[
        {label:"Invoice No",name: "invoice_no",field: "invoice_no", align: 'left', sortable: true},
        {label:"Invoice Date", name:"invoice_date",field: row => row.invoice_date,
          format: val => `${val.substring(0,10)}`, sortable: true},
        {label:"Total Amount",name: "total_amount",field: "total_amount", sortable: true},
        {label:"Note",name: "note",field: "note", sortable: true},

      ],
      sales:[],
      form:new FormData(),
      api:client,
      clients:[],
      search:"",
      searchClient:"",
      products:[],
      productSearch:"",
      services:[],
      servicesSearch:"",
      staffs:[],
      staffSearch:"",
      salesData:[],
      mode:'add',
      selectedId:"",
      currentPage:1,
      totalPage:1,
    }
  },
  created() {
    this.currentPage = 1
    this.totalPage = 1
    this.getSales()
  },
  methods:{
    EmitWarehouseData(sale){
      sale.retail_price = sale.warehouse.retail_price
      sale.total = sale.warehouse.retail_price
    },
    filterFn (val, update) {
      if (val === '') {
        update(() => {
          this.options = this.items
        })
        return
      }
      update(() => {
        const needle = val.toLowerCase()
        this.options = this.items.filter(v => v.label.toLowerCase().indexOf(needle) > -1)
      })
    },
    staffSelected(x,y){
      y.item = x.details
      y.retail_price = x.details.salary
      y.total = x.details.salary
      y.quantity = 1
    },
    machineSelected(x,y){
      y.item = x.details
      y.retail_price = x.details.cost
      y.total = x.details.cost
      y.quantity = 1
    },
    groupSelected(x,y){
      y.item = x.details
    },
    prodSelected(x,y){
      this.warehouseOptions = []
      for(let item in x.details.warehouses){
        this.warehouseOptions.push({
          label:x.details.warehouses[item].warehouse.name,
          value:x.details.warehouses[item].warehouse._id,
          stock_count:x.details.warehouses[item].stock_count,
          retail_price:x.details.warehouses[item].retail_price
        })
      }
      y.item = x.details
    },
    openAddDialog(){
      this.sales = []
      this.selectedClient = ""
      this.invoice_date = ""
      this.due_date = ""
      this.amount_paid = 0
      this.note = ""
      this.mode = 'add'
      this.openSalesAddDialog = true
    },
    OpenSalesInfo(evt,item,ind){

    },
    postSales(){
      let data = {
        items: this.sales,
        invoice_date: this.invoice_date,
        total_amount: this.total_amount,
        note:this.comments
      }
      this.api.postData('sales',data,"Sales Added").then(()=>{
        this.openSalesAddDialog = false
        this.getSales()
      })
    },
    getSales(){
      console.log(this.$props.isMobileView)
      this.api.getData('sales/'+(this.currentPage-1)).then((response)=>{
        console.log(response)
        this.salesData = response.data
        this.currentPage = response.currentPage
        this.totalPage = response.totalPage
      })
    },
    getClients(){
      this.api.getData('client/0').then((response)=>{
        this.clients = response.data
      })
    },
    searchClients(){
      if(this.searchClient && this.searchClient!==""){
        this.api.getData('client/search/'+this.searchClient).then((response)=>{
          this.clients = response.data
        })
      }
    },
    getProducts(){
      this.api.getData('product/0').then((response)=>{
        this.products = response.data
      })
    },
    searchProducts(data){
      if(data && data!==""){
        this.api.getData('product/search/'+data).then((response)=>{
          this.products = response.data
        })
      }
    },
    getServices(){
      this.api.getData('services/0').then((response)=>{
        this.services = response.data
      })
    },
    searchServices(){
      if(this.search && this.search!==""){
        this.api.getData('services/search/'+this.search).then((response)=>{
          this.services = response.data
        })
      }
    },
    getStaffs(){
      this.api.getData('user/clinicians').then((response)=>{
        this.staffs = response
      })
    },
    GoToClientDetailsPage(){
      this.$router.replace({name:"ClientDetails"})
    },
    RemoveService(ind){
      this.sales.splice(ind,ind+1)
    },
    inputSelected(item){
      if(item.onModel === 'services'){
        let service = this.services.findIndex(i=>i._id===item.item)
        if(service>=0){
          item.name =  this.services[service].name
          item.retail_price = this.services[service].retail_price
          item.tax = this.services[service].tax
          item.total = (parseInt(item.retail_price) + parseInt(item.tax/100*item.retail_price))*item.quantity
          console.log(item.total)
        }
      }
      if(item.onModel === 'product'){
        let product = this.products.findIndex(i=>i._id===item.item)
        if(product>=0){
          item.name =  this.products[product].name
          item.retail_price = this.services[product].retail_price
          item.tax = this.services[product].tax
          item.total = (parseInt(item.retail_price) + parseInt(item.tax/100*item.retail_price))*item.quantity
        }
      }
    },
    changeTotal(item){
      try{
        item.total = parseInt(item.retail_price)*item.quantity
      }catch {
        item.total = 0
      }
    },
    AddNewProduct(){
      console.log("Exe")
      this.sales.push({
        onModel:"product",
        name:"",
        warehouse:null,
        item:null,
        quantity:1,
        retail_price:0,
        total:0,
        note:""
      })
    },
    AddNewGroup(){
      this.sales.push({
        onModel:"group",
        name:"",
        item:"",
        quantity:1,
        retail_price:0,
        total:0,
        paymentType:"",
        chequeNo:"",
        note:""
      })
    },
    AddNewSupplier(){
      this.sales.push({
        onModel:"supplier",
        name:"",
        item:"",
        quantity:1,
        retail_price:0,
        total:0,
        paymentType:"",
        chequeNo:"",
        note:""
      })
    },
    AddNewMachine(){
      this.sales.push({
        onModel:"machine",
        name:"",
        item:"",
        quantity:1,
        retail_price:0,
        total:0,
        paymentType:"",
        chequeNo:"",
        note:""
      })
    },
    AddNewStaffs(){
      this.sales.push({
        onModel:"staffs",
        type:"",
        reason:"",
        name:"",
        item:"",
        quantity:1,
        retail_price:0,
        total:0,
        paymentType:"",
        chequeNo:"",
        note:""
      })
    }
  }
}
</script>
