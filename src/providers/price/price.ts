import { Injectable } from '@angular/core';
import { ApiProvider } from '../../providers/api/api';
import { DbProvider } from '../../providers/db/db';
import { LoaderProvider } from '../../providers/loader/loader';

@Injectable()
export class PriceProvider {
  public filter: any;
  public args: any;

  constructor(public api?: ApiProvider, public db?: DbProvider,  public loadingCtrl?: LoaderProvider) {
    //console.log('Hello PriceProvider Provider');

    this.filter = { 
      TOV: "",
      BUNK_ID: "-",
      BUNK_NAME: "",
      BUNKTOV_DEPT_ID: "-",
      BUNKTOV_DEPT_NAME: "",
      PLIST_ID: "-",
      PLIST: "",
      PLIST_LEVEL_ID: "",
      PLIST_LEVEL: "",
      CCY_ID: "",
      CCY: "",
      PAY_TYPE_ID: "",
      PAY_TYPE: "",
      WITH_NDS: "true",
      TOV_CCY_ID: null,
      TOV_CCY: "",
      TOV_CATEGORY_ID: [],
      SECTOR_ID: [],
      EXTRA: "",
      TOV_ID: null,
      TOV_NAME: "",
      TOV_GROUP_ID: null,
      TOV_GROUP: "",
      PRODUCT_ID: null,
      PRODUCT: "",
      TOV_PRODUCT_ID: null,
      TOV_PRODUCT: "",
      SIGNAL_ID: "",
    }

    this.args = { 
      StartRowIndex: 0,
      MaximumRows: 30,
      SortExpression: "",
      RetrieveTotalRowCount: true,
      TotalRowCount: 0
    }
  }

  async getPlistsFilter(){
    return await this.api.post("price/plistFilter")
      .then((res) => {
        return Promise.resolve(res)
      }).catch((err)=>{
        return Promise.reject(err);
      });
  }

  async getPlist(searchParams){
    return await this.api.post("price/plist", searchParams)
    .then((res) => {
       return Promise.resolve(res)
     }).catch((err)=>{
       return Promise.reject(err);
     });
  }

  async getBunks(searchParams){
    return await this.api.post("price/bunks", searchParams)
    .then((res) => {
       return Promise.resolve(res)
     }).catch((err)=>{
       return Promise.reject(err);
     });
  }

  async getSaleDepts(searchParams) {
    if (searchParams == null || searchParams === undefined) {
      searchParams = {Search: ""};
    }
    return await this.api.post("price/saleDepts", searchParams)
    .then((res) => {
       return Promise.resolve(res)
     }).catch((err)=>{
       return Promise.reject(err);
     });
  }
  
  async getPlists(searchParams){
    return await this.api.post("price/plists", searchParams)
    .then((res) => {
       return Promise.resolve(res)
     }).catch((err)=>{
       return Promise.reject(err);
     });
  }

  async getPlistLevels(searchParams)
  {
    return await this.api.post("price/plistLevels", searchParams)
    .then((res) => {
       return Promise.resolve(res)
     }).catch((err)=>{
       return Promise.reject(err);
     });
  }

  async getCCY(searchParams)
  {
    return await this.api.post("price/ccy", searchParams)
    .then((res) => {
       return Promise.resolve(res)
     }).catch((err)=>{
        return Promise.reject(err);
     });
  }

  async getOrdersPayTypesNews(searchParams)
  {
    return await this.api.post("price/ordersPayTypesNews", searchParams)
    .then((res) => {
       return Promise.resolve(res)
     }).catch((err)=>{
        return Promise.reject(err);
     });
  }
  
  async getTovsCategories()
  {
    return await this.api.post("price/tovsCategories")
    .then((res) => {
       return Promise.resolve(res)
     }).catch((err)=>{
       return Promise.reject(err);
     });
  }
    
  async getSectors()
  {
    return await this.api.post("price/sectors")
    .then((res) => {
       return Promise.resolve(res)
     }).catch((err)=>{
       return Promise.reject(err);
     });
  }

  async getExtra()
  {
    return await this.api.post("price/extra")
    .then((res) => {
       return Promise.resolve(res)
     }).catch((err)=>{
       return Promise.reject(err);
     });
  }

  async getTovs(searchParams)
  {
    return await this.api.post("price/tovs", searchParams)
    .then((res) => {
       return Promise.resolve(res)
     }).catch((err)=>{
       return Promise.reject(err);
     });
  }
  
  async getTovGroups(searchParams)
  {
    return await this.api.post("price/tovGroups", searchParams)
    .then((res) => {
       return Promise.resolve(res)
     }).catch((err)=>{
       return Promise.reject(err);
     });
  }

  async getProducts(searchParams)
  {
    return await this.api.post("price/products", searchParams)
    .then((res) => {
       return Promise.resolve(res)
     }).catch((err)=>{
      return Promise.reject(err);
     });
  }

  async getTovProducts(searchParams)
  {
    return await this.api.post("price/tovProducts", searchParams)
    .then((res) => {
       return Promise.resolve(res)
     }).catch((err)=>{
       return Promise.reject(err);
     });
  }

  async getSignals()
  {
    return await this.api.post("price/signals")
    .then((res) => {
       return Promise.resolve(res)
     }).catch((err)=>{
       return Promise.reject(err);
     });
  }

  //поиск по прайс листу
  getPlistData(filter, args, showLoading = true):Promise<any>{
    let loading = null;
    if (showLoading) {
      loading = this.loadingCtrl.show('Загрузка прайс листа...');
    }
    return this.getPlist({filter: filter, args: args})
      .then((data)=> {
        if (loading) {
          this.loadingCtrl.hide(loading);
        }
        if (data && data.result)
          return Promise.resolve(data.result);
        else
          return Promise.resolve();
      }).catch((err)=>{
        if (loading) {
          this.loadingCtrl.hide(loading);
        }
        return Promise.reject(err.message);
      });
  }
}
