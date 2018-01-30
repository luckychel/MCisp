import { Injectable } from '@angular/core';
import { App } from 'ionic-angular';
import { Http, Headers, RequestOptions, URLSearchParams } from '@angular/http';
import { Network } from '@ionic-native/network';

import 'rxjs/add/operator/map';
import 'rxjs/add/operator/toPromise';
import 'rxjs/add/operator/share';
import 'rxjs/add/operator/retry';
import 'rxjs/add/operator/timeout';
import 'rxjs/add/operator/delay';

import { LoginPage } from '../../pages/login/login';

import { DbProvider } from '../../providers/db/db';
import { ToastProvider } from '../toast/toast';

@Injectable()
export class ApiProvider {
  url: string = 'http://services.ssnab.ru:8010/api'; //    http://localhost:60544/api    http://services2.ssnab.ru:8020/api ---- 
  timeOut: number = 30000; //выставляем тайм аут запроса в 30 сек
    
  constructor(public appCtrl: App, public http: Http, public network: Network, public db: DbProvider, public toastProvider: ToastProvider) {
  }

  async get(endpoint: string, params?: any, options?: RequestOptions) : Promise<any> {

    return await this.checkNetworkConnection()
    .then(async ()=>{
      options =  await this.getOptions(options);
  
      if (params) {
        let p = new URLSearchParams();
        for (let k in params) {
          p.set(k, params[k]);
        }
        options.search = !options.search && p || options.search;
      }
      return this.http.get(this.url + '/' + endpoint, options)
      .timeout(this.timeOut)
      .toPromise()
        .then((res) => { 
          try {
            return Promise.resolve(res.json());
          } catch(err) {
            return Promise.resolve(res);
          }
        })
        .catch((err)=> 
        {
          this.checkOnError(err)
          return Promise.reject(err)
        });
    }).catch((err)=>{
      return Promise.reject(err)
    });
  }

  async post(endpoint: string, body?: any, options?: RequestOptions) : Promise<any> {
    
    return await this.checkNetworkConnection()
    .then(async ()=>{
        options =  await this.getOptions(options);
          return this.http.post(this.url + '/' + endpoint, body, options)
            .timeout(this.timeOut)
            .toPromise()
              .then((res) => {
                try {
                  return Promise.resolve(res.json());
                } catch(err) {
                  return Promise.resolve(res);
                }
              })
              .catch((err)=> {
                this.checkOnError(err)
                return Promise.reject(err)
              });
    }).catch((err)=>{
      return Promise.reject(err)
    });
  }

/*   async put(endpoint: string, body: any, options?: RequestOptions) {
    this.checkNetworkConnection();
    return this.http.put(this.url + '/' + endpoint, body, await this.getOptions(options)).toPromise().catch((err)=> this.checkOnError(err));
  }

  async delete(endpoint: string, options?: RequestOptions) {
    this.checkNetworkConnection();
    return this.http.delete(this.url + '/' + endpoint, await this.getOptions(options)).toPromise().catch((err)=> this.checkOnError(err));
  }

  async patch(endpoint: string, body: any, options?: RequestOptions) {
    this.checkNetworkConnection();
    return this.http.put(this.url + '/' + endpoint, body, await this.getOptions(options)).toPromise().catch((err)=> this.checkOnError(err));
  } */


  async getOptions(options){

    let serverToken = await this.db.getValue("serverToken").then((res) => { return res });
    if (!options) options = new RequestOptions();
    let headers = new Headers();
    if (serverToken) { 
      headers.append('Authorization', 'Bearer ' + serverToken);
    }
    options.headers = headers;
    return options;
  }

  checkNetworkConnection(): Promise<void>{
    var networkState = (this.network.type || "").toUpperCase();
    if (networkState === "") return Promise.resolve();

    var states = {};
    states["UNKNOWN"]  = 'Unknown connection';
    states["ETHERNET"] = 'Ethernet connection';
    states["WIFI"]     = 'WiFi connection';
    states["CELL_2G"]  = 'Cell 2G connection';
    states["CELL_3G"]  = 'Cell 3G connection';
    states["CELL_4G"]  = 'Cell 4G connection';
    states["CELL"]     = 'Cell generic connection';
    states["NONE"]     = 'No network connection';

    if (states[networkState] == "No network connection") {
      return this.toastProvider.show("Вы не подключены к сети интернет.").then(()=>{
        return Promise.reject(new Error())
      });
    }
    else 
    { 
      return Promise.resolve();
    }
  }

  checkOnError(err){
    var nav = this.appCtrl.getRootNav();
    if (err != null)
    {
      //Unauthorized
      if (err.status == 401)
      {
        this.toastProvider.show("Вы не авторизованы. Пожалуйста зайдите снова.")
        .then(()=>{
          nav.setRoot(LoginPage);
        });
      }
      //Timeout
      else if (err.message && err.message.toString().indexOf("Timeout") >= 0)
      {
        throw new Error("Превышен таймаут выполнения запроса.")
      }
      else
      {
        throw new Error(err);
      }
    }
    else
    {
      this.toastProvider.show("Что-то пошло не так...").then(()=>{
        nav.setRoot(LoginPage);
      });
    }
  }
 
}
