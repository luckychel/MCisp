import { Component, ViewChild } from '@angular/core';
import { NavController, NavParams, ViewController, Searchbar} from 'ionic-angular';
/* import { debounce } from 'rxjs/operator/debounce'; */
import { PriceProvider } from '../../providers/price/price';
import { LoaderProvider } from '../../providers/loader/loader';

@Component({
  selector: 'page-price-filter-choice',
  templateUrl: 'price-filter-choice.html',
})

export class PriceFilterChoicePage {
  @ViewChild('searchBar') searchbar: Searchbar;
  key: string;
  keyText: string;
  filter: any;
  items:any = [];
  items1:any = [];
  data: any;
  pSearch: string;
  showList: boolean = false;

  constructor(public navCtrl: NavController, 
    public navParams: NavParams, 
    public viewCtrl: ViewController, 
    public priceService: PriceProvider,    
    public loadingCtrl: LoaderProvider) {

    this.key = navParams.get('key');
    this.keyText = navParams.get('keyText');
    this.filter = navParams.get('filter');

  }

  //синхронность нужна только чтобы запустить метод getItems
  async ionViewDidLoad() {
    let loader = this.loadingCtrl.show();

    if (this.key == 'BUNK_ID') {
      this.data = await this.getBunk({Search: null, PlistId: null, BunkId: null})
    }
    else if (this.key == 'BUNKTOV_DEPT_ID') {
      this.data = await this.getSaleDept({Search: null})
    }
    else if (this.key == 'PLIST_ID') {
      this.data = await this.getPlists({Search: null})
    }
    else if (this.key == 'PLIST_LEVEL_ID') {
      this.data = await this.getPlistLevels({Search: null, PlistId: this.filter.PLIST_ID})
    }
    else if (this.key == 'CCY_ID') {
      this.data = await this.getCCY({Search: null})
    }
    else if (this.key == 'PAY_TYPE_ID') {
      this.data = await this.getOrdersPayTypesNews({Search: null})
    }
    else if (this.key == 'TOV_CCY_ID') {
      this.data = await this.getCCY({Search: null})
    }
    else if (this.key == 'TOV_ID') {
      this.data = await this.getTovs({Search: null})
    }
    else if (this.key == 'TOV_GROUP_ID') {
      this.data = await this.getTovGroups({Search: null})
    }
    else if (this.key == 'PRODUCT_ID') {
      this.data = await this.getProducts({Search: null})
    }
    else if (this.key == 'TOV_PRODUCT_ID') {
      this.data = await this.getTovProducts({Search: null})
    }

    this.getItems();
    this.loadingCtrl.hide(loader);

    setTimeout(() => {
      this.searchbar.initFocus();
    },500);
  }

  //получение складов
  getBunk(filter):Promise<any>
  {
    return new Promise((resolve, reject) => {
      this.priceService.getBunks(filter).then((res)=>{
          return resolve(res.result.bunks);
      }).catch((err)=>{
          return reject(err);
      })});
  }

  //получение департаментов
  getSaleDept(filter):Promise<any>{

    return new Promise((resolve, reject) => {
      this.priceService.getSaleDepts(filter).then((res)=>{
          return resolve(res.result);
      }).catch((err)=>{
        return reject(err);
      })});
  }

  //получение списка прайс листов
  getPlists(filter):Promise<any>{
    return new Promise((resolve, reject) => {
      this.priceService.getPlists(filter).then((res)=>{
          return resolve(res.result);
        }).catch((err)=>{
          return reject(err.message);
      })});
  }

  //получение списка прайс д
  getPlistLevels(filter):Promise<any>{
    return new Promise((resolve, reject) => {
      this.priceService.getPlistLevels(filter).then((res)=>{
          return resolve(res.result);
        }).catch((err)=>{
          return reject(err.message);
      })});
  }

  //получение валюты
  getCCY(filter):Promise<any>{
    return new Promise((resolve, reject) => {
      this.priceService.getCCY(filter).then((res)=>{
          return resolve(res.result);
        }).catch((err)=>{
          return reject(err.message);
      })});
  }

  //получение условия
  getOrdersPayTypesNews(filter):Promise<any>{
    return new Promise((resolve, reject) => {
      this.priceService.getOrdersPayTypesNews(filter).then((res)=>{
          return resolve(res.result);
        }).catch((err)=>{
          return reject(err.message);
      })});
  }

  //получение ТП
  getTovs(filter):Promise<any>{
    return new Promise((resolve, reject) => {
      this.priceService.getTovs(filter).then((res)=>{
          return resolve(res.result);
        }).catch((err)=>{
          return reject(err.message);
      })});
  }

  //получение ТПГ
  getTovGroups(filter):Promise<any>{
    return new Promise((resolve, reject) => {
      this.priceService.getTovGroups(filter).then((res)=>{
          return resolve(res.result);
        }).catch((err)=>{
          return reject(err.message);
      })});
  }

  //получение ВГП
  getProducts(filter):Promise<any>{
    return new Promise((resolve, reject) => {
      this.priceService.getProducts(filter).then((res)=>{
          return resolve(res.result);
        }).catch((err)=>{
          return reject(err.message);
      })});
  }
  
  //получение ТПР
  getTovProducts(filter):Promise<any>{
    return new Promise((resolve, reject) => {
      this.priceService.getTovProducts(filter).then((res)=>{
          return resolve(res.result);
        }).catch((err)=>{
          return reject(err.message);
      })});
  }

  //рисуем
  getItems() {
    this.items = [];

    if (this.pSearch && this.pSearch.trim() != '') {

      this.items = this.data.filter((item) => {
          if (this.key =="BUNK_ID") {
            return (item.name.toLowerCase().indexOf(this.pSearch.toLowerCase()) > -1 || item.bunk_id.toString().toLowerCase().indexOf(this.pSearch.toLowerCase()) > -1);
          }
          else if (this.key =="BUNKTOV_DEPT_ID") {
            return (item.NAME.toLowerCase().indexOf(this.pSearch.toLowerCase()) > -1 || item.DEPT_ID.toString().toLowerCase().indexOf(this.pSearch.toLowerCase()) > -1);
          }
          else if (this.key =="PLIST_ID") {
            return (item.PLIST.toLowerCase().indexOf(this.pSearch.toLowerCase()) > -1 || item.PLIST_ID.toString().toLowerCase().indexOf(this.pSearch.toLowerCase()) > -1);
          }
          else if (this.key =="PLIST_LEVEL_ID") {
            return (item.NAME.toLowerCase().indexOf(this.pSearch.toLowerCase()) > -1 || item.LEVEL_ID.toString().toLowerCase().indexOf(this.pSearch.toLowerCase()) > -1);
          }
          else if (this.key =="CCY_ID") {
            return (item.NAME.toLowerCase().indexOf(this.pSearch.toLowerCase()) > -1);
          }
          else if (this.key =="PAY_TYPE_ID") {
            return (item.NAME.toLowerCase().indexOf(this.pSearch.toLowerCase()) > -1 || item.NOTE.toString().toLowerCase().indexOf(this.pSearch.toLowerCase()) > -1);
          }
          else if (this.key =="TOV_CCY_ID") {
            return (item.NAME.toLowerCase().indexOf(this.pSearch.toLowerCase()) > -1);
          }
          else if (this.key =="TOV_ID") {
            return (item.NAME.toLowerCase().indexOf(this.pSearch.toLowerCase()) > -1 || item.TOV_ID.toString().toLowerCase().indexOf(this.pSearch.toLowerCase()) > -1);
          }
          else if (this.key =="TOV_GROUP_ID") {
            return (item.NAME.toLowerCase().indexOf(this.pSearch.toLowerCase()) > -1 || item.TOV_GROUP_ID.toString().toLowerCase().indexOf(this.pSearch.toLowerCase()) > -1);
          }
          else if (this.key =="PRODUCT_ID") {
            return (item.NAME.toLowerCase().indexOf(this.pSearch.toLowerCase()) > -1 || item.PRODUCT_ID.toString().toLowerCase().indexOf(this.pSearch.toLowerCase()) > -1);
          }
          else if (this.key =="TOV_PRODUCT_ID") {
            return (item.NAME.toLowerCase().indexOf(this.pSearch.toLowerCase()) > -1 || item.TOV_PRODUCT_ID.toString().toLowerCase().indexOf(this.pSearch.toLowerCase()) > -1);
          }

      });
      this.items = this.mapItems(this.items);
    }
    else
    {
      this.items = this.mapItems(this.data);
    }
    
    if (this.items.length > 0)
    {
      this.showList = true;
      this.items1 = this.items;
      this.items = this.items.slice(0,30);
    }
    else
    {
      this.showList = false;
    }
   
  }

  mapItems(pItems){
    return pItems.map((item) => {

      if (this.key =="BUNK_ID") {
        return {
          id: item.bunk_id, 
          name: (item.name || "") + (item.bunk_id !== "" && item.bunk_id !== "" ? " | " : "") + (item.bunk_id || ""),
          name1: (item.name || ""),
          choose: this.filter.BUNK_ID == item.bunk_id ? true : false
        }
      }
      else if (this.key =="BUNKTOV_DEPT_ID") {
        return {
          id: item.DEPT_ID, 
          name: (item.NAME || "") + (item.DEPT_ID !== "" && item.DEPT_ID !== "" ? " | " : "") + (item.DEPT_ID || ""),
          name1: (item.NAME || ""),
          choose: this.filter.BUNKTOV_DEPT_ID == item.DEPT_ID ? true : false
        };
      }
      else if (this.key =="PLIST_ID") {
        return {
          id: item.PLIST_ID, 
          name: (item.PLIST || "") + (item.PLIST_ID !== "" && item.PLIST_ID !== "" ? " | " : "") + (item.PLIST_ID || ""),
          name1: (item.PLIST || ""),
          choose: this.filter.PLIST_ID == item.PLIST_ID ? true : false
        };
      }
      else if (this.key =="PLIST_LEVEL_ID") {
        return {
          id: item.LEVEL_ID, 
          name: (item.NAME || "") + (item.LEVEL_ID !== "" && item.LEVEL_ID !== "" ? " | " : "") + (item.LEVEL_ID || ""),
          name1: (item.NAME || ""),
          choose: this.filter.LEVEL_ID == item.LEVEL_ID ? true : false
        };
      }
      else if (this.key =="CCY_ID") {
        return {
          id: item.CCY_ID, 
          name: (item.NAME || ""),
          name1: (item.NAME || ""),
          choose: this.filter.CCY_ID == item.CCY_ID ? true : false
        };
      }
      else if (this.key =="PAY_TYPE_ID") {
        return {
          id: item.NEW_PAY_TYPE_ID, 
          name: (item.NAME || "") + (item.NEW_PAY_TYPE_ID !== "" && item.NEW_PAY_TYPE_ID !== "" ? " | " : "") + (item.NEW_PAY_TYPE_ID || ""),
          name1: (item.NAME || ""),
          choose: this.filter.PAY_TYPE_ID == item.NEW_PAY_TYPE_ID ? true : false
        };
      }
      else if (this.key =="TOV_CCY_ID") {
        return {
          id: item.CCY_ID, 
          name: (item.NAME || ""),
          name1: (item.NAME || ""),
          choose: this.filter.TOV_CCY_ID == item.CCY_ID ? true : false
        };
      }
      else if (this.key =="TOV_ID") {
        return {
          id: item.TOV_ID, 
          name: (item.NAME || "") + (item.TOV_ID !== "" && item.TOV_ID !== "" ? " | " : "") + (item.TOV_ID || ""),
          name1: (item.NAME || ""),
          choose: this.filter.TOV_ID == item.TOV_ID ? true : false
        };
      }
      else if (this.key =="TOV_GROUP_ID") {
        return {
          id: item.GROUP_ID, 
          name: (item.NAME || "") + (item.GROUP_ID !== "" && item.GROUP_ID !== "" ? " | " : "") + (item.GROUP_ID || ""),
          name1: (item.NAME || ""),
          choose: this.filter.TOV_GROUP_ID == item.GROUP_ID ? true : false
        };
      }
      else if (this.key =="PRODUCT_ID") {
        return {
          id: item.PRODUCT_ID, 
          name: (item.NAME || "") + (item.PRODUCT_ID !== "" && item.PRODUCT_ID !== "" ? " | " : "") + (item.PRODUCT_ID || ""),
          name1: (item.NAME || ""),
          choose: this.filter.PRODUCT_ID == item.PRODUCT_ID ? true : false
        };
      }
      else if (this.key =="TOV_PRODUCT_ID") {
        return {
          id: item.TOV_PRODUCT_ID, 
          name: (item.NAME || "") + (item.TOV_PRODUCT_ID !== "" && item.TOV_PRODUCT_ID !== "" ? " | " : "") + (item.TOV_PRODUCT_ID || ""),
          name1: (item.NAME || ""),
          choose: this.filter.TOV_PRODUCT_ID == item.TOV_PRODUCT_ID ? true : false
        };
      }
    });
  }

  doInfinite(): Promise<any> {

    return new Promise((resolve) => {
      setTimeout(() => {
        let len = this.items.length;
        for (var i = len; i < len + 30 && this.items.length < this.items1.length; i++) {
          this.items.push(this.items1[i]);
        }
        resolve();
      }, 500);
    })
  }

  onClear(ev) { 
    this.removeData();
    ev.stopPropagation();
  }

  removeData(){
    this.pSearch = null;
    this.getItems();
    //this.showList = false;
  }

  clickItem(ev){
    this.items = this.items.map((item)=>{
      item.choose = false;
      return item;
    });
    this.pSearch = ev.name;
    ev.choose = true;

    if (this.key =="BUNK_ID") {
        this.filter.BUNK_ID = ev.id;
        this.filter.BUNK_NAME = ev.name1;
    }
    else if (this.key =="BUNKTOV_DEPT_ID") {
       this.filter.BUNKTOV_DEPT_ID = ev.id;
       this.filter.BUNKTOV_DEPT_NAME = ev.name1;
    }
    else if (this.key =="PLIST_ID") {
      this.filter.PLIST_ID = ev.id;
      this.filter.PLIST = ev.name1;
    }
    else if (this.key =="PLIST_LEVEL_ID") {
      this.filter.PLIST_LEVEL_ID = ev.id;
      this.filter.PLIST_LEVEL = ev.name1;
    }
    else if (this.key =="CCY_ID") {
      this.filter.CCY_ID = ev.id;
      this.filter.CCY = ev.name1;
    }
    else if (this.key =="PAY_TYPE_ID") {
      this.filter.PAY_TYPE_ID = ev.id;
      this.filter.PAY_TYPE = ev.name1;
    }
    else if (this.key =="TOV_CCY_ID") {
      this.filter.TOV_CCY_ID = ev.id;
      this.filter.TOV_CCY = ev.name1;
    }
    else if (this.key =="TOV_ID") {
      this.filter.TOV_ID = ev.id;
      this.filter.TOV_NAME = ev.name1;
    }
    else if (this.key =="TOV_GROUP_ID") {
      this.filter.TOV_GROUP_ID = ev.id;
      this.filter.TOV_GROUP = ev.name1;
    }
    else if (this.key =="PRODUCT_ID") {
      this.filter.PRODUCT_ID = ev.id;
      this.filter.PRODUCT = ev.name1;
    }
    else if (this.key =="TOV_PRODUCT_ID") {
      this.filter.TOV_PRODUCT_ID = ev.id;
      this.filter.TOV_PRODUCT = ev.name1;
    }

    this.viewCtrl.dismiss(this.filter);
  }

  close(){
    this.viewCtrl.dismiss();
  }
}
