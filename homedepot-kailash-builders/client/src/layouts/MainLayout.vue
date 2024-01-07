<template>
  <q-layout  view="lHh lpR fFf">
    <q-header reveal bordered class="bg-white text-black">
      <q-toolbar style="padding-left: 20px">
        <q-btn v-if="!isMobileView" flat @click="miniMode = !miniMode" dense icon="menu" />
        <q-btn v-if="isMobileView" flat @click="left = !left" dense icon="menu" />
        <q-toolbar-title class="q-pl-md">
          <div class="text-body1 text-bold">{{topText}}</div>
        </q-toolbar-title>
        <div align="right" class="q-pa-sm text-right q-gutter-xs">
          <q-btn-dropdown no-caps flat color="accent">
            <template v-slot:label>
              <q-avatar round>
                <q-icon name="account_circle" ></q-icon>
              </q-avatar>
              <span class="q-pl-sm">{{name}}</span>
            </template>
            <q-list>
              <q-item @click="logoutUser" clickable v-close-popup>
                <q-item-section avatar>
                  <q-avatar color="accent" text-color="white" icon="logout" />
                </q-item-section>
                <q-item-section>
                  <q-item-label>Logout</q-item-label>
                </q-item-section>
              </q-item>
            </q-list>
          </q-btn-dropdown>
        </div>
      </q-toolbar>
    </q-header>
    <q-drawer
      :behavior="getBehaviour"
      show-if-above
      v-model="left"
      side="left"
      :width="200"
      :mini-width="80"
      :breakpoint="300"
      content-class="bg-primary text-black"
      bordered >
      <!-- drawer content -->
      <q-scroll-area class="fit">
        <div class="text-center text-h6 text-bold q-pa-md text-white">
          <q-img style="max-height: 80px" contain src="../assets/kailashNew.png"></q-img>
        </div>
        <q-list class="q-pa-sm text-caption text-white">
          <q-item :key="item.name" v-for="item in sidebarItems" active-class="text-yellow" class="q-pa-md" :active="link === item.active" clickable v-ripple @click="RouteToProduct(item)">
            <q-item-section avatar>
              <q-icon size="28px" :name="item.icon"></q-icon>
            </q-item-section>
            <q-item-section style="font-size: 1.15em">
              {{item.name}}
            </q-item-section>
            <q-tooltip transition-show="scale"
                       transition-hide="scale" content-class="bg-black" anchor="center right" self="center left" :offset="[10, 10]">
              <span class="text-body1 text-bold">{{item.name}}</span>
            </q-tooltip>
          </q-item>
        </q-list>
      </q-scroll-area>
    </q-drawer>
    <q-card :style="'min-height: '+this.allHeight+'px'" v-touch-swipe.right.left="handleSwipe">
      <q-page-container>
        <q-resize-observer @resize="onResize" />
        <router-view :mobileView="isMobileView" />
      </q-page-container>
    </q-card>
  </q-layout>
</template>

<script>
import {LocalStorage} from "quasar";

let height = window.innerHeight
export default {
  computed:{
    getBehaviour(){
      return this.isMobileView?'mobile':'default'
    }
  },
  data () {
    return {
      allHeight:height,
      drawerBehavior:"desktop",
      sidebarItems:[
        {
          name:"Dashboard",
          icon:"space_dashboard",
          routeName:"dashboard",
          active:"dashboard"
        },
        {
          name:"Approvals",
          icon:"verified",
          routeName:"approvals",
          active:'approvals'
        },
        {
          name:"Warehouses",
          icon:"maps_home_work",
          routeName:"warehouse",
          active:'warehouse'
        },
        {
          name:"Groups",
          icon:"groups",
          routeName:"groups",
          active:'groups'
        },
        {
          name:"Sites",
          icon:"construction",
          routeName:"sites",
          active:'sites'
        },
        {
          name:"Inventory",
          icon:"inventory_2",
          routeName:"inventory_dashboard",
          active:'inventory_dashboard'
        },
        {
          name:"Machinery",
          icon:"precision_manufacturing",
          routeName:"machines",
          active:'machines'
        },
        {
          name:"Receipts",
          icon:"receipt_long",
          routeName:"receipts",
          active:'receipts'
        },
        {
          name:"Sales",
          icon:"paid",
          routeName:"sales_main",
          active:'sales_main'
        },
        {
          name:"Staffs",
          icon:"people",
          routeName:"staffs",
          active:'staffs'
        },
      ],
      miniMode:false,
      email:"admin@admin.com",
      left: false,
      isMobileView:false,
      link:"dashboard",
      topText:"Dashboard",
      name:""
    }
  },
  watch:{
    '$route.name':function () {
      console.log(this.$route.name)
      this.TestRouter(this.$route.name)
    }
  },
  created() {
    this.name = LocalStorage.getItem('name')
    let fullName = this.name.split(' ')
    this.name = fullName[0]
  },
  methods:{
    logoutUser(){
      localStorage.clear()
      this.$router.replace({name:"Main"})
    },
    onResize (size) {
      this.isMobileView = size.width <= 1025;
    },
    handleSwipe({ evt, ...info }){
      console.log(info)
      if(info.direction === 'right'){
        this.left = true
      }
      else if(info.direction === 'left'){
        this.left = false
      }
    },
    RouteToProduct(item){
      this.$router.replace({name:item.routeName})
    },
    TestRouter(RouteName){
      if(RouteName==='dashboard'){
        this.link = 'dashboard'
        this.topText = "Dashboard"
        console.log(RouteName)
      }
      else if(RouteName==='warehouse'){
        this.link = 'warehouse'
        this.topText = "Warehouses"
      }
      else if(RouteName==='approvals'){
        this.link = 'approvals'
        this.topText = "Approvals"
      }
      else if(RouteName==='receipts'){
        this.link = 'receipts'
        this.topText = "Receipts"
      }
      else if(RouteName==='sites'){
        this.link = 'sites'
        this.topText = "Sites"
      }
      else if(RouteName==='machines'){
        this.link = 'machines'
        this.topText = "Machines"
      }
      else if(RouteName==='groups'){
        this.link = 'groups'
        this.topText = "Groups"
      }
      else if(RouteName==='inventory_dashboard'){
        this.link = 'inventory_dashboard'
        this.topText = "Inventory"
      }
      else if(RouteName==='sales_main'){
        this.link = 'sales_main'
        this.topText = "Sales"
      }
      else if(RouteName ==='staffs'||RouteName ==='staff_details'){
        this.link = 'staffs'
        this.topText = "Staffs"
      }
    },
  }
}
</script>
