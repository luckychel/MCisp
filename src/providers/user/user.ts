import { Injectable } from '@angular/core';

import { ApiProvider } from '../../providers/api/api';
import { DbProvider } from '../../providers/db/db';

@Injectable()
export class UserProvider {

  _user : { login: string, password: string, isAuth: boolean, authError: string, isRemember: boolean, molId: string, molName: string,molPhoto: string, registrationId: string, serverToken: string } = {
    login: "",
    password: "",
    isAuth: false,
    authError: "",
    isRemember: false,
    molId: "",
    molName: "",
    molPhoto: "",
    registrationId: "",
    serverToken: ""
  };
  
  constructor(public api: ApiProvider, private db: DbProvider ) {
    //console.log('Hello UserProvider Provider');
  }
  
  login(account: any) {

    let asyncTask = new Promise((resolve, reject) => {
      try {
        let t11 = this.db.setValue('login', account.isRemember ? account.login : "");
        let t12 = this.db.setValue('password', account.isRemember ? account.password : "");
        let t13 = this.db.setValue('isRemember', account.isRemember);
    
        let auth = Promise.all([t11, t12, t13])
        .then(() => this.api.post('auth', account)
          .then(res => this._user = res.json()))
          .catch((err)=> reject(new Error(err.message)))
        .catch((err)=> reject(new Error(err.message)));

        return Promise.all([auth])
          .then(()=> {
            if (this._user.isAuth)
              {
                let t21 = this.db.setValue('molId', this._user.molId);
                let t22 = this.db.setValue('molName', this._user.molName);
                let t23 = this.db.setValue('molPhoto', this._user.molPhoto);
                let t24 = this.db.setValue('serverToken', this._user.serverToken);
                let t25 = this.db.setValue('isAuth', this._user.isAuth);
                return Promise.all([t21, t22, t23, t24, t25]).then(()=> { 
                  resolve(true);
                });
              }
              else {
                reject(new Error(this._user.authError));
              }
          }).catch((err)=>{
            reject(new Error(err.message));
          });
      }
      catch (err) {
        reject(new Error('Ошибка получения таблицы настроек ' + err.message));
      }
    });
    return asyncTask;
  }

  checkToken(){
    let asyncTask = new Promise((resolve, reject) => {
      try {
        return this.api.get('auth')
          .then(res => {
            resolve(true);
          }).catch((err)=>{
            if (err !== undefined && err.message !== undefined) {
              reject(new Error(err.message));
              return
            } 
            reject(new Error("Вы не авторизованы. Пожалуйста выполните вход в МКИСП!"));
          });
      }
      catch (err){
        reject(new Error('Ошибка проверки на валидность токена ' + err.message));
      }
    });
    return asyncTask;
  }

  registration(userInfo: any){
    return this.api.post('mols/registration', userInfo)
      .then((res)=>{
        return res.json();
      }).catch((err)=>{
        throw new Error(err.message || err.statusText);
      })
  }

  unregistration(userInfo: any)
  {
    return this.api.post("mols/unregistration", userInfo)
  }

}
