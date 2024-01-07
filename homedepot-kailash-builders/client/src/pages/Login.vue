<template>
  <div :style="'background: linear-gradient(to left, #f64f59, #c471ed, #12c2e9);'+'min-height:'+allHeight+'px;'+'min-width:'+allWidth+'px;'">
    <div class="row justify-center">
      <div style="padding-top: 5%" class="col-xl-4 col-lg-4 col-md-6 col-sm-8 col-xs-12">
        <div class="rounded-xl black--text white">
          <div class="bg-primary q-pa-xl">
            <q-img style="max-height: 200px" contain src="../assets/kailashNew.png"></q-img>
          </div>
          <q-card  class="" style="padding: 5%" color="white">
            <q-card-section class="text-body1 text-h6 text-left">
              <div class="text-bold q-pb-sm">Username/Email</div>
              <q-input
                outlined
                v-model="email"
                placeholder="Type Username/Email"
                prepend-inner-icon="mdi-account-circle"
              ></q-input>
            </q-card-section>
            <q-card-section class="text-h6 text-bold text-left">
              <div class=" q-pb-sm">Password</div>
              <q-input
                outlined
                v-model="password"
                type="password"
                placeholder="Type Password"
                prepend-inner-icon="mdi-lock"
              ></q-input>
            </q-card-section>
            <q-card-section class="text-body-1 text-center">
              <q-btn
                @click="Login"
                class="text-bold"
                color="primary"
                size="md"
              >Sign In</q-btn>
            </q-card-section>
          </q-card>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import client from "src/api/Client";
import {LocalStorage} from "quasar";

let height = window.innerHeight
let width = window.innerWidth
export default {
  data(){
    return{
      allHeight:height,
      allWidth:width,
      state: client,
      email:"",
      password:""
    }
  },
  methods:{
    GoToDashboardPage(){
      this.$router.replace({name:"dashboard"})
    },
    Login(){
      this.state.loginUser(
        {
          email:this.email,
          password:this.password
        }
      ).then((data)=>{
        if(data.accessToken){
          this.GoToDashboardPage()
        }
      })
    }
  }
}
</script>
