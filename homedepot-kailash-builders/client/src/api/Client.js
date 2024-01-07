import {action, computed, observable} from 'mobx';
import ky from 'ky'
import { LocalStorage } from 'quasar'

import Vue from 'vue'
import { Notify } from 'quasar'
import {
  Loading,

  // optional!, for example below
  // with custom spinner
  QSpinnerGears
} from 'quasar'


let clientApi = ky.create({
  retry: {
    limit: 0,
  }
});

let loginApi = ky.create({
  retry: {
    limit: 0,
  }
});

if(LocalStorage.getItem('accessToken')) {
  clientApi = ky.extend({
    hooks: {
      beforeRequest: [
        async (request) => {
          try {
            let token = LocalStorage.getItem('accessToken')
            let data = await ky.post(process.env.VUE_APP_SERVER + '/auth/verify/access-token', { json: { token: token } })
            if (data.ok) {
              let dat = await data.json()
              if (dat.verified) {
                request.headers.set('Authorization', LocalStorage.getItem('accessToken'));
              }
              else {
                try {
                  let body = { refreshToken: LocalStorage.getItem('refreshToken') }
                  const json = await ky.post(process.env.VUE_APP_SERVER + '/auth/refresh-token', { json: body })
                  if (json.ok) {
                    let tokenData = await json.json()
                    LocalStorage.set('accessToken',tokenData.accessToken)
                    LocalStorage.set('refreshToken',tokenData.refreshToken)
                    LocalStorage.set('name',tokenData.name)
                    request.headers.set('Authorization', tokenData.accessToken);
                  }
                } catch (error) {
                  console.log("Go To Home")
                }
              }
            }
          } catch (error) {
            const serverMessage = await error.response.json();
            let errorMsg = ""
            if (serverMessage.error) {
              errorMsg = serverMessage.error.message
            }
            else {
              errorMsg = serverMessage.message
            }
            Notify.create({
              type: 'negative',
              color: 'negative',
              timeout: 1000,
              position: 'bottom',
              message: errorMsg
            })
          }
        }
      ],
    }
  });
}


class Client{
  @observable tokenData = {};
  @observable client_data = {};
  @action.bound setClientData(data){
    this.client_data = data
  }
  @action.bound setTokenData(data){
    this.tokenData = data
  }
  @action.bound setClient(){
    clientApi = ky.extend({
      hooks: {
        beforeRequest: [
          async (request) => {
            try {
              let token = LocalStorage.getItem('accessToken')
              let data = await ky.post(process.env.VUE_APP_SERVER + '/auth/verify/access-token', { json: { token: token } })
              if (data.ok) {
                let dat = await data.json()
                if (dat.verified) {
                  request.headers.set('Authorization', LocalStorage.getItem('accessToken'));
                }
                else {
                  try {
                    let body = { refreshToken: LocalStorage.getItem('refreshToken') }
                    const json = await ky.post(process.env.VUE_APP_SERVER + '/auth/refresh-token', { json: body })
                    if (json.ok) {
                      let tokenData = await json.json()
                      LocalStorage.set('accessToken',tokenData.accessToken)
                      LocalStorage.set('refreshToken',tokenData.refreshToken)
                      LocalStorage.set('name',tokenData.name)
                      request.headers.set('Authorization', tokenData.accessToken);
                    }
                  } catch (error) {
                    console.log("Go To Home")
                  }
                }
              }
            } catch (error) {
              const serverMessage = await error.response.json();
              let errorMsg = ""
              if (serverMessage.error) {
                errorMsg = serverMessage.error.message
              }
              else {
                errorMsg = serverMessage.message
              }
              Notify.create({
                type: 'negative',
                color: 'negative',
                timeout: 1000,
                position: 'bottom',
                message: errorMsg
              })
            }
          }
        ],
      }
    });
  }
  @computed get getClientData(){
    return this.client_data
  }
  @action.bound setToken(token){
    loginApi = ky.extend({
      hooks: {
        beforeRequest: [
          request => {
            request.headers.set('Authorization', token);
          }
        ]
      }
    });
  }
  @action.bound async loginUser(body) {
    try {
      let data = await loginApi.post('login',{prefixUrl:process.env.VUE_APP_SERVER+'/auth',json:body})
      if(data.ok){
        Notify.create({
          type: 'positive',
          color: 'positive',
          timeout: 1000,
          position: 'bottom',
          message: "Login Successful"
        })
        let loginData = await data.json()
        LocalStorage.set('accessToken',loginData.accessToken)
        LocalStorage.set('refreshToken',loginData.refreshToken)
        LocalStorage.set('name',loginData.name)
        this.setTokenData(loginData)
        this.setToken(this.tokenData.accessToken)
        this.setClient()
        return this.tokenData
      }
    }
    catch (error) {
      Loading.hide()
      const serverMessage = await error.response.json();
      let errorMsg = ""
      if(serverMessage.error){
        errorMsg = serverMessage.error.message
      }
      else{
        errorMsg = serverMessage.message
      }
      Notify.create({
        type: 'negative',
        color: 'negative',
        timeout: 1000,
        position: 'bottom',
        message: errorMsg
      })
    }
  }
  @action.bound async postData(url,body,message){
    try {
      Loading.show()
      let data = await clientApi.post(url,{prefixUrl:process.env.VUE_APP_SERVER+'/',json:body})
      if(data.ok){
        Loading.hide()
        let dat = await data.json()
        Notify.create({
          type: 'positive',
          color: 'positive',
          timeout: 1000,
          position: 'bottom',
          message: message
        })
        return dat
      }
    }
    catch (error) {
      Loading.hide()
      const serverMessage = await error.response.json();
      let errorMsg = ""
      if(serverMessage.error){
        errorMsg = serverMessage.error.message
      }
      else{
        errorMsg = serverMessage.message
      }
      Notify.create({
        type: 'negative',
        color: 'negative',
        timeout: 1000,
        position: 'bottom',
        message: errorMsg
      })
    }
  }
  @action.bound async getData(url){
    try {
      Loading.show()
      let data = await clientApi(url,{prefixUrl:process.env.VUE_APP_SERVER+''},)
      if(data.ok){
        Loading.hide()
        return await data.json()
      }
    }
    catch (error) {
      Loading.hide()
      const serverMessage = await error.response.json();
      let errorMsg = ""
      if(serverMessage.error){
        errorMsg = serverMessage.error.message
      }
      else{
        errorMsg = serverMessage.message
      }
      Notify.create({
        type: 'negative',
        color: 'negative',
        timeout: 1000,
        position: 'bottom',
        message: errorMsg
      })
    }
  }
  @action.bound async putData(url,body,message){
    try {
      Loading.show()
      let data = await clientApi.put(url,{prefixUrl:process.env.VUE_APP_SERVER+'',json:body})
      if(data.ok){
        Loading.hide()
        Notify.create({
          type: 'positive',
          color: 'positive',
          timeout: 1000,
          position: 'bottom',
          message: message
        })
        let dat = data.json()
        return dat
      }
    }
    catch (error) {
      Loading.hide()
      const serverMessage = await error.response.json();
      let errorMsg = ""
      if(serverMessage.error){
        errorMsg = serverMessage.error.message
      }
      else{
        errorMsg = serverMessage.message
      }
      Notify.create({
        type: 'negative',
        color: 'negative',
        timeout: 1000,
        position: 'bottom',
        message: errorMsg
      })
    }
  }
}

let client = new Client()

export default client
