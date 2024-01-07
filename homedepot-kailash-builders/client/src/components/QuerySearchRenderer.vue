<script src="../api/formData.js"></script>
<template>
  <div>
    <q-dialog
      maximized
      transition-show="slide-up"
      transition-hide="slide-down"
      v-model="openAddDialog"
    >
      <q-card >
        <q-toolbar
          flat
          class="text-white bg-primary"
          color="primary"
        >
          <q-toolbar-title class="text-h5 font-weight-bold">New {{itemLabel}} Add</q-toolbar-title>
          <q-btn
            icon="close"
            flat
            @click="openAddDialog = false"
          >
          </q-btn>
        </q-toolbar>
        <q-card-section class="text-left">
          <div class="row justify-center pt-4">
            <div class="col-lg-8 col-md-9 col-sm-11 col-xs-12 pa-2">
              <div class="row">
                <div class="col-12">
                  <simple-form-renderer @dataSaved="saveData" @closeDialog="openAddDialog = false" :form-details="newAddForm"></simple-form-renderer>
                </div>
              </div>
            </div>
          </div>
        </q-card-section>
      </q-card>
    </q-dialog>
    <div v-if="addedItems">
      <q-select
        class="shadow-1"
        filled
        v-model="selectedDetails"
        option-label="label"
        option-value="value"
        use-input
        @input="EmitSelectedData"
        input-debounce="0"
        :label="itemLabel"
        :options="options"
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
  </div>
</template>
<script>
import api from "../api/Client";
import FormData from "../api/formData";
export default {
  props:['type','multiple','details'],
  data(){
    return{
      loading:false,
      addedItems:false,
      searchValue:"",
      items:[],
      options:[],
      selectedDetails:null,
      itemLabel:"",
      itemPlaceHolder:"",
      openAddDialog:false,
      newAddForm:[],
      query: api,
      form: new FormData()
    }
  },
  methods:{
    filterFn (val, update) {
      if (val === '') {
        update(() => {
          this.options = this.items
        })
        return
      }
      update(() => {
        const needle = val.toLowerCase()
        if(this.$props.type === 'product_search'){
          this.SearchProduct(needle)
        }
        else if(this.$props.type === 'group_search'){
          this.SearchGroups(needle)
        }
        else {
          this.options = this.items.filter(v => v.label.toLowerCase().indexOf(needle) > -1)
        }
      })
    },
    saveData(){
      let saveData = this.form.createPostObject(this.newAddForm)
      if(this.$props.type === 'category_search'){
        this.query.postData('category',saveData,'Category Added').then(()=>{
          this.getCategory()
          this.openAddDialog = false
        })
      }
      if(this.$props.type === 'machine_search'){
        this.query.postData('machine',saveData,'Machine Added').then(()=>{
          this.getMachine()
          this.openAddDialog = false
        })
      }
      else if(this.$props.type === 'warehouse_search'){
        this.query.postData('warehouse',saveData,'Warehouse Added').then(()=>{
          this.getWarehouse()
          this.openAddDialog = false
        })
      }
      else if(this.$props.type === 'site_search'){
        this.query.postData('site',saveData,'Site Added').then(()=>{
          this.getWarehouse()
          this.openAddDialog = false
        })
      }
      else if(this.$props.type === 'group_search'){
        this.query.postData('group',saveData,'Group Added').then(()=>{
          this.getGroups()
          this.openAddDialog = false
        })
      }
      else if(this.$props.type === 'services_search'){
        this.query.postData('category',saveData,'Category Added').then(()=>{
          this.getServices()
          this.openAddDialog = false
        })
      }
      else if(this.$props.type === 'brand_search'){
        this.query.postData('brand',saveData,'Brand Added').then(()=>{
          this.getBrand()
          this.openAddDialog = false
        })
      }
      else if(this.$props.type === 'supplier_search'){
        this.query.postData('supplier',saveData,'Supplier Added').then(()=>{
          this.getSupplier()
          this.openAddDialog = false
        })
      }
      else if(this.$props.type === 'user_search'){
        this.query.postData('user',saveData,'User Added').then(()=>{
          this.getUser()
          this.openAddDialog = false
        })
      }
    },
    EmitSelectedData(){
      if(this.selectedDetails.value === "Add New"){
        this.openAddDialog = true
      }
      else {
        this.$emit('selectQuery',{
          type:this.$props.type,
          details:this.selectedDetails
        })
      }
    },
    getCategory(){
      this.query.getData('category/get').then(response=>{
        this.items = []
        for(let i=0;i<response.length;i++){
          this.items.push({
            label:response[i].name,
            value:response[i]._id
          })
        }
        this.items.push({
          label:"Add New",
          value:"Add New"
        })
        this.itemPlaceHolder = "Type To Search For Categories"
        this.setDetails()
        this.addedItems = true
      })
    },
    getServices(){
      this.query.getData('category/get/services').then(response=>{
        this.items = []
        for(let i=0;i<response.length;i++){
          this.items.push({
            label:response[i].name,
            value:response[i]._id
          })
        }
        this.items.push({
          label:"Add New",
          value:"Add New"
        })
        this.itemPlaceHolder = "Type To Search For Categories"
        this.setDetails()
        this.addedItems = true
      })
    },
    getBrand(){
      this.query.getData('brand/get').then(response=>{
        this.items = []
        for(let i=0;i<response.length;i++){
          this.items.push({
            label:response[i].name,
            value:response[i]._id
          })
        }
        this.items.push({
          label:"Add New",
          value:"Add New"
        })
        this.itemPlaceHolder = "Type To Search For Brands"
        this.setDetails()
        this.addedItems = true
      })
    },
    getSupplier(){
      this.query.getData('supplier/get').then(response=>{
        this.items = []
        for(let i=0;i<response.length;i++){
          this.items.push({
            label:response[i].name,
            value:response[i]._id
          })
        }
        this.items.push({
          label:"Add New",
          value:"Add New"
        })
        this.itemPlaceHolder = "Type To Search For Suppliers"
        this.setDetails()
        this.addedItems = true
      })
    },
    getUser(){
      this.query.getData('user/get').then(response=>{
        console.log(response)
        this.items = []
        for(let i=0;i<response.length;i++){
          this.items.push({
            label:response[i].full_name,
            value:response[i]._id,
            salary:response[i].monthly_salary,
            salary_start:response[i].salary_start_date
          })
        }
        this.items.push({
          label:"Add New",
          value:"Add New"
        })
        this.itemPlaceHolder = "Type To Search For Users"
        this.setDetails()
        this.addedItems = true
      })
    },
    getWarehouse(){
      this.query.getData('warehouse/get').then(response=>{
        this.items = []
        for(let i=0;i<response.length;i++){
          this.items.push({
            label:response[i].name,
            value:response[i]._id
          })
        }
        this.items.push({
          label:"Add New",
          value:"Add New"
        })
        this.itemPlaceHolder = "Type To Search For Warehouse"
        this.setDetails()
        this.addedItems = true
      })
    },
    getSite(){
      this.query.getData('site/get').then(response=>{
        console.log(response)
        this.items = []
        for(let i=0;i<response.length;i++){
          this.items.push({
            label:response[i].name,
            value:response[i]._id
          })
        }
        this.items.push({
          label:"Add New",
          value:"Add New"
        })
        this.itemPlaceHolder = "Type To Search For Site"
        this.setDetails()
        this.addedItems = true
      })
    },
    setDetails(){
      if(this.$props.details){
        if(this.$props.type === 'product_search'){
          this.query.getData('product/get/'+this.$props.details).then((resp)=>{
            this.selectedDetails = {
              label:resp.name,
              value:this.$props.details
            }
          })
        }
        else if(this.$props.type === 'group_search'){
          this.query.getData('group/get/'+this.$props.details).then((resp)=>{
            this.selectedDetails = {
              label:resp.name,
              value:this.$props.details
            }
          })
        }
        else if(this.$props.type === 'supplier_search'){
          if(Array.isArray(this.$props.details)){
            let ind = this.items.findIndex(i=>i.value===this.$props.details[0])
            this.selectedDetails = {
              label:this.items[ind].label,
              value:this.$props.details[0]
            }
          }
          else {
            let ind = this.items.findIndex(i=>i.value===this.$props.details)
            this.selectedDetails = {
              label:this.items[ind].label,
              value:this.$props.details
            }
          }
        }
        else {
          console.log(this.$props.details)
          let ind = this.items.findIndex(i=>i.value===this.$props.details)
          this.selectedDetails = {
            label:this.items[ind].label,
            value:this.$props.details
          }
        }
      }
    },
    SearchProduct(search){
      this.query.getData('product/search/sales/'+search).then((response)=>{
        console.log(response)
        this.items = []
        for(let i=0;i<response.data.length;i++){
          this.items.push({
            label:response.data[i].name,
            value:response.data[i]._id,
            warehouses:response.data[i].warehouses
          })
        }
        this.items.push({
          label:"Add New",
          value:"Add New"
        })
        this.options = [...this.items]
        this.itemPlaceHolder = "Type To Search For Products"
        this.setDetails()
        this.addedItems = true
      })
    },
    SearchGroups(search){
      this.query.getData('group/search/'+search).then((response)=>{
        this.items = []
        for(let i=0;i<response.data.length;i++){
          this.items.push({
            label:response.data[i].name,
            value:response.data[i]._id
          })
        }
        this.items.push({
          label:"Add New",
          value:"Add New"
        })
        this.options = [...this.items]
        this.itemPlaceHolder = "Type To Search For Groups"
        this.setDetails()
        this.addedItems = true
      })
    },
    getMachine(){
      this.query.getData('machine/get').then((response)=>{
        for(let i=0;i<response.length;i++){
          this.items.push({
            label:response[i].name,
            value:response[i]._id,
            cost:response[i].cost_per_hour
          })
        }
        this.items.push({
          label:"Add New",
          value:"Add New"
        })
        this.itemPlaceHolder = "Type To Search For Warehouse"
        this.setDetails()
        this.addedItems = true
      })
    },
    getGroups(){
      this.query.getData('group/0').then(response=>{
        this.items = []
        for(let i=0;i<response.data.length;i++){
          this.items.push({
            label:response.data[i].name,
            value:response.data[i]._id
          })
        }
        this.items.push({
          label:"Add New",
          value:"Add New"
        })
        this.itemPlaceHolder = "Type To Search For Groups"
        this.setDetails()
        this.addedItems = true
      })
    },
    getProducts(){
      this.query.getData('product/sales/0').then(response=>{
        this.items = []
        for(let i=0;i<response.data.length;i++){
          this.items.push({
            label:response.data[i].name,
            value:response.data[i]._id,
            warehouses:response.data[i].warehouses
          })
        }
        this.items.push({
          label:"Add New",
          value:"Add New"
        })
        this.itemPlaceHolder = "Type To Search For Warehouse"
        this.setDetails()
        this.addedItems = true
      })
    }
  },
  created() {
    this.addedItems = false
    if(this.$props.type ==='category_search'){
      this.getCategory()
      this.itemLabel = "Category"
      this.newAddForm = this.form.category_form
    }
    else if(this.$props.type ==='warehouse_search'){
      console.log("Executed")
      this.getWarehouse()
      this.itemLabel = "Warehouse"
      this.newAddForm = this.form.warehouse_form
    }
    else if(this.$props.type ==='product_search'){
      console.log("Executed")
      this.getProducts()
      this.itemLabel = "Products"
      this.newAddForm = this.form.products_form
    }
    else if(this.$props.type ==='group_search'){
      this.getGroups()
      this.itemLabel = "Groups"
      this.newAddForm = this.form.group_form
    }
    else if(this.$props.type ==='site_search'){
      this.getSite()
      this.itemLabel = "Sites"
      this.newAddForm = this.form.site_form
    }
    else if(this.$props.type ==='machine_search'){
      this.getMachine()
      this.itemLabel = "Machine"
      this.newAddForm = this.form.machine_form
    }
    else if(this.$props.type ==='user_search'){
      this.getUser()
      this.itemLabel = "User"
      this.newAddForm = this.form.user_form
    }
    else if(this.$props.type ==='services_search'){
      this.getServices()
      this.itemLabel = "Category"
      this.newAddForm = this.form.category_form
    }
    else if(this.$props.type ==='brand_search'){
      this.getBrand()
      this.itemLabel = "Brand"
      this.newAddForm = this.form.brand_form
    }
    else if(this.$props.type ==='supplier_search'){
      this.getSupplier()
      this.itemLabel = "Supplier"
      this.newAddForm = this.form.supplier_form
    }
    else if(this.$props.type ==='supplier_search_arr'){
      this.getSupplier()
      this.itemLabel = "Supplier"
      this.newAddForm = this.form.supplier_form
    }
  }
}
</script>
