import { action, computed, observable} from 'mobx';
import ky from 'ky'
import Vue from 'vue'
import { Notify } from 'quasar'


let api = ky.create({prefixUrl: 'http://localhost:3000/auth',retry:0});

export default class Login {
  @observable age = 10;
  @observable users = [];
  @observable tokenData = {}

  @computed get computedAge() {
    return this.age + 1;
  }

  @action.bound setAge() {
    this.age++;
  }

  @action.bound setTokenData(data){
    this.tokenData = data
  }

  @action.bound setToken(token){
    api = ky.extend({
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
      let data = await api.post('login',{
        json:body,
      })
      if(data.ok){
        Notify.create({
          type: 'positive',
          color: 'positive',
          timeout: 1000,
          position: 'bottom',
          message: "Login Successful"
        })
        let loginData = await data.json()
        this.setTokenData(loginData)
        this.setToken(this.tokenData.refreshToken)
        return this.tokenData
      }
    }
    catch (error) {
      const serverMessage = await error.response.json();
      let errorMsg = ""
      console.log(serverMessage)
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
