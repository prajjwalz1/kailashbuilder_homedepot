<template>
  <div v-if="allData" class="row">
    <div :key="ind" v-for="(item,ind) in allData" class="col-lg-6 col-md-6 col-sm-12 col-xs-12 q-pa-sm">
      <q-list style="min-height: 100%" bordered class="rounded-borders">
        <q-item-label class="text-bold" header>{{item.type}} in {{getIcon(item,'name')}}</q-item-label>
        <q-item>
          <q-item-section avatar top>
            <q-icon :name="getIcon(item,'icon')" color="orange-10" size="34px" />
          </q-item-section>
          <q-item-section top>
            <q-item-label  class="q-pb-xs" >
              <b>{{ item.product_id.name }}</b>
            </q-item-label>
            <q-item-label v-if="item.warehouse" class="q-pt-xs q-pb-xs" >
              <b>Warehouse : </b> {{item.warehouse.name}}
            </q-item-label>
            <q-item-label v-if="item.group" class="q-pt-xs q-pb-xs" >
              <b>Group : </b> {{item.group.name}}
            </q-item-label>
            <q-item-label v-if="item.site" class="q-pt-xs q-pb-xs" >
              <b>Site : </b> {{item.site.name}}
            </q-item-label>
            <q-item-label v-if="item.warehouse_end && item.warehouse_end.name" class="q-pt-xs q-pb-xs" >
              <b>Transferred To : </b> {{item.warehouse_end.name}}
            </q-item-label>
            <q-item-label v-if="item.group_end && item.group_end.name" class="q-pt-xs q-pb-xs" >
              <b>Transferred To : </b> {{item.group_end.name}}
            </q-item-label>
            <q-item-label v-if="item.site_end && item.site_end.name" class="q-pt-xs q-pb-xs" >
              <b>Transferred To : </b> {{item.site_end.name}}
            </q-item-label>
            <q-item-label v-if="item.supplier && item.supplier.name" class="q-pt-xs q-pb-xs" >
              <b>Supplier : </b> {{item.supplier.name}}
            </q-item-label>
            <q-item-label v-if="item.added_by" class="q-pt-xs q-pb-xs" >
              <b>Issued By : </b> {{item.added_by}}
            </q-item-label>
            <q-item-label class="q-pt-xs q-pb-xs" >
              <b>Added On : </b> {{item.added_on.substring(0,10)}}
            </q-item-label>
            <q-item-label class="q-pt-xs q-pb-xs" >
              <b>Stock : </b> {{item.stock_count}}
            </q-item-label>
            <q-item-label v-if="item.retail_price && item.retail_price !== ''" class="q-pt-xs q-pb-xs" >
              <b>Retail Price : </b> Rs.{{item.retail_price}}
            </q-item-label>
            <q-item-label class="q-pt-xs q-pb-xs" >
              <b>Total Price : </b> Rs.{{item.total_amount}}
            </q-item-label>
          </q-item-section>
        </q-item>
      </q-list>
    </div>
  </div>
</template>
<script>
export default {
  props:['datas'],
  watch:{
    $props: {
      handler() {
        this.parseData();
      },
      deep: true,
      immediate: true,
    },
  },
  data(){
    return{
      allData:null
    }
  },
  methods:{
    parseData(){
      this.allData = this.$props.datas
    },
    getIcon(item,type){
      console.log(item)
      if(item.type==='Transferred Data' && type==='icon'){
        return 'transfer_within_a_station'
      }
      if(item.warehouse){
        if(type === 'name')
          return 'Warehouse'
        else if(type === 'icon')
          return 'maps_home_work'
      }
      else if(item.group){
        if(type === 'name')
          return 'Group'
        else if(type === 'icon')
          return 'groups'
      }
      else if(item.site){
        if(type === 'name')
          return 'Site'
        else if(type === 'icon')
          return 'construction'
      }
    }
  }
}
</script>
