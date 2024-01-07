<template>
  <div v-if="formData.length>=1">
    <q-stepper
      :contracted="this.$props.mobView"
      v-model="formStepper"
      ref="stepper"
      color="primary"
      animated
    >
      <q-step
        v-for="(dat,index) in returnFormData"
        :name="dat.step"
        :title="dat.name"
        icon="settings"
        :done="formStepper > dat.step"
        :key="dat.name"
      >
        <div class="row">
          <div :key="ind" v-for="(item,ind) in dat.qDetails" :class="getClass(item.type)">
            <b>{{item.topLabel}}</b>
            <div v-if="item.type === 'text'">
              <q-input :type="item.inputType" :label="item.inputType==='date'?'':item.comment" :placeholder="item.placeholder" v-model="item.details" filled class="shadow-1"></q-input>
            </div>
            <div v-if="item.type === 'multiImageUpload'">
              <div :key="image" class="q-pb-md" v-for="image in item.imageCount">
                <b>Select Document No {{image}}</b>
                <image-upload :dat="{mainInd:index,subInd:ind}" class="q-mt-sm" @selectImage="addImages"></image-upload>
              </div>
              <q-btn @click="addMoreImages(item)" color="orange-10" label="Add Documents"></q-btn>
            </div>
            <div v-if="item.type === 'select'">
              <q-select
                v-if="!item.freeTextEnabled"
                :options="item.options"
                option-value="value"
                option-label="label"
                :label="item.comment"
                v-model="item.details"
                :placeholder="item.placeholder"
                @input="CheckFreeTextEnabled(item)"
                filled
                class="shadow-1"
                emit-value
                map-options
              >
              </q-select>
              <q-input v-if="item.freeTextEnabled" filled class="shadow-1" :label="item.comment" :placeholder="item.placeholder" v-model="item.details">
              </q-input>
              <q-btn class="q-mt-md" v-if="item.freeTextEnabled" color="warning" @click="item.freeTextEnabled = false">Cancel</q-btn>
            </div>
            <div v-if="item.type === 'radio'">
              <div v-if="!item.freeTextEnabled">
                <q-radio
                  v-for="(n,ind) in item.options"
                  :key="ind"
                  :label="n.label"
                  :val="n.value"
                  @input="CheckFreeTextEnabled(item)"
                  v-model="item.details" >
                </q-radio>
              </div>
              <q-input v-if="item.freeTextEnabled" filled class="shadow-1" :label="item.comment" :placeholder="item.placeholder" v-model="item.details">
              </q-input>
              <q-btn v-if="item.freeTextEnabled" color="warning" @click="item.freeTextEnabled = false">Cancel</q-btn>
            </div>
            <div v-if="item.type === 'switch'">
              <q-toggle
                class="ml-2"
                v-model="item.details"
                inset
                :label="item.comment"
              ></q-toggle>
            </div>
            <div v-if="item.type === 'triggerSwitch'">
              <q-toggle
                class="ml-2"
                v-model="item.details"
                inset
                @change="triggerStepper(item)"
                :label="item.comment"
              ></q-toggle>
            </div>
            <div v-if="item.type === 'fileUpload'">
              <image-upload :dat="{mainInd:index,subInd:ind}" class="q-mt-sm" @selectImage="addImages"></image-upload>
            </div>
            <div v-if="item.type ==='staff_select'">
              <q-checkbox
                v-for="(staff,ind) in staff_list"
                :key="ind"
                v-model="item.details"
                :label="staff.label"
                :value="staff.value"
              ></q-checkbox>
            </div>
            <div v-if="item.type === 'warehouse_data' || item.type === 'group_data' || item.type === 'site_data'">
              <div :key="ind" v-for="(warehouse,ind) in item.details">
                <q-card flat class=" shadow-0 q-mt-md q-pt-sm q-mb-md">
                  <q-card-section class="no-padding">
                    <div class="row">
                      <div class="col-12 q-pl-md">
                        <span class="float-left text-bold">Enter Details For {{getDataLabel(item.type)}} No {{ind+1}}</span>
                        <span class="float-right">
                      <q-btn push size="sm" round @click="deleteWarehouse(item.details,ind)" icon="close" color="red-10"></q-btn>
                    </span>
                      </div>
                      <div class="col-lg-4 col-md-4 col-sm-6 col-xs-12 q-pa-md">
                        <div class="q-pb-sm text-bold">Select Supplier</div>
                        <query-search-renderer :details="warehouse.supplier" @selectQuery="supplierSelected($event,warehouse)" type="supplier_search"></query-search-renderer>
                      </div>
                      <div v-if="item.type === 'warehouse_data'" class="col-lg-4 col-md-4 col-sm-6 col-xs-12  q-pa-md">
                        <div class="q-pb-sm text-bold">Select Warehouse</div>
                        <query-search-renderer :details="warehouse.warehouse" @selectQuery="warehouseSelected($event,warehouse)" type="warehouse_search"></query-search-renderer>
                      </div>
                      <div v-if="item.type === 'group_data'" class="col-lg-4 col-md-4 col-sm-6 col-xs-12  q-pa-md">
                        <div class="q-pb-sm text-bold">Select Group</div>
                        <query-search-renderer :details="warehouse.group" @selectQuery="groupSelected($event,warehouse)" type="group_search"></query-search-renderer>
                      </div>
                      <div v-if="item.type === 'site_data'" class="col-lg-4 col-md-4 col-sm-6 col-xs-12  q-pa-md">
                        <div class="q-pb-sm text-bold">Select Site</div>
                        <query-search-renderer :details="warehouse.site" @selectQuery="siteSelected($event,warehouse)" type="site_search"></query-search-renderer>
                      </div>
                      <div class="col-lg-4 col-md-4 col-sm-6 col-xs-12 q-pa-md">
                        <div class="q-pb-sm text-bold">Price Per {{selectedCategory}}</div>
                        <q-input type="number" @input="calculateTotal(warehouse)" filled class="shadow-1" label="Enter Price" :placeholder="'Price per '+selectedCategory" v-model="warehouse.retail_price">
                        </q-input>
                      </div>
                      <div class="col-lg-4 col-md-4 col-sm-6 col-xs-12 q-pa-md">
                        <div class="q-pb-sm text-bold">Stock Count({{'in '+selectedCategory}})</div>
                        <q-input  type="number" @input="calculateTotal(warehouse)" filled class="shadow-1" label="Enter Stock Count" :placeholder="'in '+selectedCategory" v-model="warehouse.stock_count">
                        </q-input>
                      </div>
                      <div class="col-lg-4 col-md-4 col-sm-6 col-xs-12 q-pa-md">
                        <div class="q-pb-sm text-bold">Total Amount</div>
                        <q-input type="number" filled class="shadow-1" label="Enter Total Price" v-model="warehouse.total_amount">
                        </q-input>
                      </div>
                      <div class="col-lg-4 col-md-4 col-sm-6 col-xs-12 q-pa-md">
                        <div class="q-pb-sm text-bold">Stock Reorder Point</div>
                        <q-input type="number" filled class="shadow-1" label="Enter Reorder Amount" v-model="warehouse.reorder_point">
                        </q-input>
                      </div>
                    </div>
                  </q-card-section>
                </q-card>
              </div>
              <q-btn :size="$props.mobView?'sm':'md'" icon="add" rounded outline class="q-ml-md q-mt-md text-bold" color="orange-10" @click="addNewWarehouse(item)" :label="'Add New '+getDataLabel(item.type)"></q-btn>
            </div>
            <div v-if="item.type === 'querySearch'">
              <query-search-renderer @selectQuery="querySelected" :details="item.details" :type="item.query"></query-search-renderer>
            </div>
          </div>
          <div class="col-12 q-pa-md">
            <q-btn @click="saveData" color="primary" class="q-ma-sm" v-if="returnFormStepper.toString() === formStepper">
              Save
            </q-btn>
            <q-btn
              class="q-ma-sm"
              v-if="returnFormStepper.toString() !== formStepper"
              color="primary"
              @click="goToNextForm"
            >
              Continue
            </q-btn>
            <q-btn
              class="q-ma-sm"
              v-if="formStepper >1"
              color="orange-10"
              @click="goToBackForm"
            >
              Back
            </q-btn>
            <q-btn text
                   color="red-10"
                   @click="CloseDialog"
                   class="q-ma-sm">
              Cancel
            </q-btn>
          </div>
        </div>
      </q-step>
    </q-stepper>
  </div>
</template>
<script>
import client from "../api/Client.js";
import QuerySearchRenderer from './QuerySearchRenderer.vue'
import ImageUploadComponent from "pages/ImageUploadComponent";

export default {
  components:{
    'query-search-renderer':QuerySearchRenderer,
    "image-upload":ImageUploadComponent,
  },
  props:['formDetails','formDialog','mobView'],
  computed:{
    returnFormData(){
      return this.formData.filter(i=>i.isShown === true)
    },
    returnFormStepper(){
      return this.formData.filter(i=>i.isShown === true).length
    }
  },
  data(){
    return{
      formData:[],
      formSteppersCount:0,
      formStepper:"1",
      api:client,
      selectedCategory:""
    }
  },
  methods:{
    getClass(type){
      if(type === 'warehouse_data' || type === 'group_data' || type === 'site_data'){
        return `col-12 q-pb-lg`
      }
      else {
        return `col-lg-4 col-md-4 col-sm-6 col-xs-12 q-pa-md`
      }
    },
    addMoreImages(item){
      if(item.imageCount<=5){
        item.imageCount++
      }
      else {
        this.$q.notify({
          color: 'red-5',
          textColor: 'white',
          icon: 'fas fa-exclamation-triangle',
          message: "Cannot Add More Than 6 Images"
        })
      }
    },
    getDataLabel(type){
      if(type === 'warehouse_data'){
        return `Warehouse`
      }
      if(type === 'group_data'){
        return `Group`
      }
      if(type === 'site_data'){
        return `Site`
      }
    },
    addImages(data){
      this.formData[data.details.mainInd].qDetails[data.details.subInd].details = data.image
    },
    addNewWarehouse(it){
      if(typeof it.details !== 'object'){
        it.details = []
      }
      if(it.type === 'warehouse_data'){
        it.details.push({
          supplier:"",
          warehouse:"",
          retail_price:0,
          stock_count:0,
          total_amount:0,
          reorder_point:0
        })

      }
      else if(it.type === 'group_data'){
        it.details.push({
          supplier:"",
          group:"",
          retail_price:0,
          stock_count:0,
          total_amount:0,
          reorder_point:0
        })
      }
      else if(it.type === 'site_data'){
        it.details.push({
          supplier:"",
          site:"",
          retail_price:0,
          stock_count:0,
          total_amount:0,
          reorder_point:0
        })
      }
    },
    warehouseSelected(x,y){
      y.warehouse = x.details.value
    },
    groupSelected(x,y){
      y.group = x.details.value
    },
    siteSelected(x,y){
      y.site = x.details.value
    },
    supplierSelected(x,y){
      y.supplier = [x.details.value]
    },
    calculateTotal(warehouse){
      try{
        warehouse.total_amount = parseInt(warehouse.retail_price)*parseInt(warehouse.stock_count)
      }catch (e){
        warehouse.total_amount = 0
      }
    },
    deleteWarehouse(it,ind){
      it.splice(ind,1)
    },
    returnFormCol(item){
      if(item.type === 'warehouse_data'){
        return `col-12`
      }
      else {
        return `col-lg-4 col-md-4 col-sm-6 col-xs-12`
      }
    },
    querySelected(data){
      for(let i=0;i<this.formData.length;i++){
        let ind = this.formData[i].qDetails.findIndex(j=>j.query === data.type)
        if(ind>=0){
          if(data.type === 'category_search'){
            this.selectedCategory = data.details.label
          }
          this.formData[i].qDetails[ind].details = data.details.value
        }
      }
    },
    saveData(){
      console.log(this.formData)
      this.$emit('dataSaved',this.formData)
    },
    goToNextForm(){
      let currentInd = this.formStepper
      for(let i=currentInd;i<this.formData.length;i++){
        if(this.formData[i].isShown === true){
          this.formStepper = (parseInt(i)+1).toString()
          break;
        }
      }
    },
    goToBackForm(){
      if(this.formData.length >=3){
        let currentInd = this.formStepper - 2
        for(let i=currentInd;i>=0;i--){
          if(this.formData[i].isShown === true){
            this.formStepper =  (parseInt(i)+1).toString()
            break;
          }
        }
      }
      else {
        this.formStepper = (this.formStepper -1).toString()
      }

    },
    triggerStepper(item){
      console.log("executed")
      let ind = this.formData.findIndex(i=>i.name === item.triggerValue)
      this.formData[ind].isShown = item.details
    },
    getBase64(det) {
      var reader = new FileReader();
      if(this.$refs.uploadImage.files[0].size<2097152){
        reader.readAsDataURL(this.$refs.uploadImage.files[0]);
        reader.onload = function () {
          det.details = reader.result
        };
        reader.onerror = function (error) {
          console.log('Error: ', error);
        };
      }
      else {
        this.$q.notify({
          color: 'red-5',
          textColor: 'white',
          icon: 'fas fa-exclamation-triangle',
          message: "File Should be less than 2MB"
        })
        this.$refs.uploadImage.files = null
      }
    },
    CheckFreeTextEnabled(data){
      if(data.details === 'Free Text'){
        data.details = ""
        data.freeTextEnabled = true
      }
    },
    CloseDialog(){
      this.$emit('closeDialog')
      this.$props.formDialog = false
    }
  },
  created() {
    this.formData = this.$props.formDetails
    this.formSteppersCount = this.formData.length
    for(let i=0;i<this.formData.length;i++){
      let findStaff = this.formData[i].qDetails.find(i=>i.type ==='staff_select')
      console.log(findStaff)
      if(findStaff){
        console.log("Check")
        /*
        this.api.getData('user/clinicians').then((response)=>{
          this.staff_list = []
          for(let i=0;i<response.length;i++){
            this.staff_list.push({
              label:response[i].full_name,
              value:response[i]._id
            })
          }
        })

         */
      }
    }
  }
}
</script>
