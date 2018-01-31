import { Component } from '@angular/core';
import { NavController, NavParams, ModalController, ViewController } from 'ionic-angular';

import { LoaderProvider } from '../../providers/loader/loader';
import { PriceFilterChoisePage } from '../price-filter-choise/price-filter-choise';
import { PriceProvider } from '../../providers/price/price';

@Component({
  selector: 'page-price-filter',
  templateUrl: 'price-filter.html',
})

export class PriceFilterPage {
  items: any;
  filter: any;
  args: any;
  findText: string = "Найдено 0 записей";
  tovsCategoriesItems: any;
  sectorsItems: any;
  extraItems: any;
  signaltems: any;
  filterTextTimeout: any;

  constructor(public navCtrl: NavController, 
    public navParams: NavParams, 
    public priceService: PriceProvider,
    public modalCtrl: ModalController,
    public loadingCtrl: LoaderProvider,
    public viewCtrl: ViewController
  ) 
  {
    this.filter = priceService.filter;
    this.filter.TOV = navParams.get('filter').TOV;
    this.args = priceService.args;
    this.tovsCategoriesItems = [];
    this.sectorsItems = [];
    this.extraItems = [];
    this.signaltems = [];

  }
  
/*   popView(){
    this.navCtrl.pop();
  } */
  
  async ionViewWillEnter() {
    //this.molId = await this.db.getValue("molId");
  }

  //список фильров по умолчанию
  ionViewDidLoad(){

    let loading = this.loadingCtrl.show();
    this.findText = "Инициализация...";
    this.priceService.getPlistsFilter()
      .then((dfilter)=> {
        let r1 = this.getBunks({Search: null, PlistId: dfilter.PLIST_ID, BunkId: dfilter.BUNK_ID});
        let r2 = this.getSaleDepts(null);
        let r3 = this.getPlists({Search: null, PlistId: dfilter.PLIST_ID});
        let r4 = this.getPlistLevels({Search: null, PlistId: dfilter.PLIST_ID});
        let r5 = this.getCcy({Search: dfilter.CCY_ID});
        let r6 = this.getOrdersPayTypesNews({Search: null, PayTypeId: dfilter.PAY_TYPE_ID});
        let r7 = this.getTovsCategories();
        let r8 = this.getSectors();
        let r9 = this.getExtra();
        let r10 = this.getTovs({Search: ""});
        let r11 = this.getTovGroups({Search: ""});
        let r12 = this.getProducts({Search: ""});
        let r13 = this.getTovProducts({Search: ""});
        let r14 = this.getSignals();

        Promise.all([r1, r2, r3, r4, r5, r6, r7, r8, r9, r10, r11, r12, r13, r14])
          .then((res)=>{
            this.loadingCtrl.hide(loading);
            this.getPlist();
          })
          .catch((err)=> { 
            this.loadingCtrl.hide(loading);
            throw new Error(err.message);
          });
    }).catch((err)=>{
        this.loadingCtrl.hide(loading);
        alert(err.message)
    });
  }
  
//получение фильтра "Склад" 
getBunks(filter):Promise<any>{
  if (filter.Search == "")
    return;

  return this.priceService.getBunks(filter)
    .then((res)=>{
      if (filter.Search == null)
      {
        if (res.result.bunks[0] !== undefined)
        {
          this.filter.BUNK_ID = res.result.bunks[0].bunk_id;
          this.filter.BUNK_NAME = res.result.bunks[0].name;
        }
      }
      Promise.resolve();
    }).catch((err)=>{
      Promise.reject(err.message);
    });
}

//получение фильтра "Отдел" 
 getSaleDepts(filter):Promise<any>{

  return this.priceService.getSaleDepts(filter)
    .then((res)=>{
      if (res.result[0] !== undefined)
      {
        this.filter.BUNKTOV_DEPT_ID = res.result[0].DEPT_ID;
        this.filter.BUNKTOV_DEPT_NAME = res.result[0].NAME;
      }
      Promise.resolve();
    }).catch((err)=>{
      Promise.reject(err.message);
    });
 }

//получение фильтра "Прайс" 
getPlists(filter):Promise<any>{
  if (filter.Search == "")
    return;

  return this.priceService.getPlists(filter).then((res)=>{
      if (res.result[0] !== undefined)
      {
        this.filter.PLIST_ID = res.result[0].PLIST_ID;
        this.filter.PLIST = res.result[0].PLIST;
      }
      Promise.resolve();
    }).catch((err)=>{
      Promise.reject(err.message);
    });
}

//получение фильтра "Прайс Д" 
getPlistLevels(filter):Promise<any>{
  if (filter.Search == "")
    return;

  return this.priceService.getPlistLevels(filter).then((res)=>{
      if (res.result[0] !== undefined)
      {
        this.filter.PLIST_LEVEL_ID = res.result[0].LEVEL_ID;
        this.filter.PLIST_LEVEL = res.result[0].NAME;
      }
      Promise.resolve();
    }).catch((err)=>{
      Promise.reject(err.message);
    });
}

//получение фильтра "Валюта"
getCcy(filter):Promise<any>{
  if (filter.Search == "")
    return;

  return this.priceService.getCCY(filter).then((res)=>{
      if (res.result[0] !== undefined)
      {
        this.filter.CCY_ID = res.result[0].CCY_ID;
        this.filter.CCY = res.result[0].NAME;
      }
      Promise.resolve();
    }).catch((err)=>{
      Promise.reject(err.message);
    });
}

 //получение фильтра "Условия"
 getOrdersPayTypesNews(filter):Promise<any>{
  if (filter.Search == "")
    return;

    return this.priceService.getOrdersPayTypesNews(filter).then((res)=>{
      if (res.result[0] !== undefined)
      {
        this.filter.PAY_TYPE_ID = res.result[0].NEW_PAY_TYPE_ID;
        this.filter.PAY_TYPE = res.result[0].NAME;
      }
      Promise.resolve();
      }).catch((err)=>{
        Promise.reject(err.message);
    });
}

//Получение фильтра "Категории ТП"
getTovsCategories():Promise<any>{

    return this.priceService.getTovsCategories().then((res)=>{
      if (res.result !== undefined)
      {
        for(let i = 0; i < res.result.length; i++) {
          this.tovsCategoriesItems.push(res.result[i]);
        }
      }
      Promise.resolve();
      }).catch((err)=>{
        Promise.reject(err.message);
    });
}

//Получение фильтра "Отрасли"
getSectors():Promise<any>{

  return this.priceService.getSectors().then((res)=>{
    if (res.result !== undefined)
    {
      for(let i = 0; i < res.result.length; i++) {
        this.sectorsItems.push(res.result[i]);
      }
    }
    Promise.resolve();
    }).catch((err)=>{
      Promise.reject(err.message);
  });
}


//Получение фильтра "Дополнительно"
getExtra():Promise<any>{

  return this.priceService.getExtra().then((res)=>{
    if (res.result !== undefined)
    {
      for(let i = 0; i < res.result.length; i++) {
        this.extraItems.push(res.result[i]);
      }
    }
    Promise.resolve();
    }).catch((err)=>{
      Promise.reject(err.message);
  });
}

//Получение фильтра "ТП"
getTovs(filter):Promise<any>{
  if (filter.Search == "")
    return;

  return this.priceService.getTovs(filter).then((res)=>{
    if (res.result[0] !== undefined)
    {
      this.filter.TOV_ID = res.result[0].TOV_ID;
      this.filter.TOV_NAME = res.result[0].NAME;
    }
    Promise.resolve();
    }).catch((err)=>{
      Promise.reject(err.message);
  });
}


//Получение фильтра "ТПГ"
getTovGroups(filter):Promise<any>{
  if (filter.Search == "")
    return;

  return this.priceService.getTovGroups(filter).then((res)=>{
    if (res.result[0] !== undefined)
    {
      this.filter.TOV_GROUP_ID = res.result[0].TOV_GROUP_ID;
      this.filter.TOV_GROUP = res.result[0].NAME;
    }
    Promise.resolve();
    }).catch((err)=>{
      Promise.reject(err.message);
  });
}


//Получение фильтра "ВГП"
getProducts(filter):Promise<any>{
  if (filter.Search == "")
    return;

  return this.priceService.getProducts(filter).then((res)=>{
    if (res.result[0] !== undefined)
    {
      this.filter.PRODUCT_ID = res.result[0].PRODUCT_ID;
      this.filter.PRODUCT = res.result[0].NAME;
    }
    Promise.resolve();
    }).catch((err)=>{
      Promise.reject(err.message);
  });
}


//Получение фильтра "ТПР"
getTovProducts(filter):Promise<any>{
  if (filter.Search == "")
    return;

  return this.priceService.getTovProducts(filter).then((res)=>{
    if (res.result[0] !== undefined)
    {
      this.filter.TOV_PRODUCT_ID = res.result[0].TOV_PRODUCT_ID;
      this.filter.TOV_PRODUCT = res.result[0].NAME;
    }
    Promise.resolve();
    }).catch((err)=>{
      Promise.reject(err.message);
  });
}


//Получение фильтра "Индикатор"
getSignals():Promise<any>{
  return this.priceService.getSignals().then((res)=>{
    if (res.result !== undefined)
    {
      for(let i = 0; i < res.result.length; i++) {
        this.signaltems.push(res.result[i]);
      }
    }
    Promise.resolve();
    }).catch((err)=>{
      Promise.reject(err.message);
  });
}


  //поиск по прайс листу
  getPlist():Promise<any>{
    //let loading = this.loadingCtrl.show('Загрузка прайс листа...');
    
    this.findText = "Ищем...";
    //debugger;
    return this.priceService.getPlist({filter: this.filter, args: this.args})
      .then((data)=>{
        
        if (data && data.result) {
          if (data.result.plist) {
            this.items = data.result.plist;
          }
          if (data.result.args) {
            this.args = data.result.args;
            if (data.result.args.TotalRowCount == 0) {
              this.findText = "Данных не найдено";  
            }
            else {
              this.findText = "Показать " + data.result.args.TotalRowCount + " записей";  
            }
          }
        }
        //if (loading) this.loadingCtrl.hide(loading);
        Promise.resolve();
      }).catch((err)=>{
        //if (loading) this.loadingCtrl.hide(loading);
        Promise.reject(err.message);
      });
  }


  //**************СОБЫТИЯ*******************//

  //Поиск по ТП
  standartTovHeight(){
    if (this.filter.TOV==='') 
      return true;
    else
      return false;
  }

  onTovChange(){
    if (this.filterTextTimeout) clearTimeout(this.filterTextTimeout);
      this.filterTextTimeout = setTimeout(() => {
      this.getPlist();
    }, 500); // delay 500 ms
  }

  onTovClear(ev) { 
    this.filter.TOV = "";
    this.getPlist();
  }

  //Склад
  standartBunkHeight(){
    if (this.filter.BUNK_NAME==='') 
      return true;
    else
      return false;
  }

  onBunkSelect()
  {
    this.showModalView("BUNK_ID", "склада");
  }

  onBunkClear(ev) { 
    this.filter.BUNK_ID = "";
    this.filter.BUNK_NAME = "";
    this.getPlist();
  }

  //Отдел
  standartBunkTovDeptHeight(){
    if (this.filter.BUNKTOV_DEPT_NAME==='') 
      return true;
    else
      return false;
  }

  onBunkTovDeptSelect()
  {
    this.showModalView("BUNKTOV_DEPT_ID", "отдела");
  }

  onBunkTovDeptClear(ev) { 
    this.filter.BUNKTOV_DEPT_ID = "";
    this.filter.BUNKTOV_DEPT_NAME = "";
    this.getPlist();
  }

  //Прайс
  standartPlistHeight(){
    if (this.filter.PLIST==='') 
      return true;
    else
      return false;
  }

  onPlistSelect(){
    this.showModalView("PLIST_ID", "прайса");
  }

  onPlistClear(ev) { 
    this.filter.PLIST_ID = "";
    this.filter.PLIST = "";
    this.getPlist();
  }

//Прайс Д
standartPlistLevelHeight(){
  if (this.filter.PLIST_LEVEL==='') 
    return true;
  else
    return false;
}

onPlistLevelSelect(){
  this.showModalView("PLIST_LEVEL_ID", "прайса д");
}

onPlistLevelClear(ev) { 
  this.filter.PLIST_LEVEL_ID = "";
  this.filter.PLIST_LEVEL = "";
  this.getPlist();
}

//Валюта
standartCcyHeight(){
  if (this.filter.CCY==='') 
    return true;
  else
    return false;
}

onCcySelect(){
  this.showModalView("CCY_ID", "валюты");
}

onCcyClear(ev) { 
  this.filter.CCY_ID = "";
  this.filter.CCY = "";
  this.getPlist();
}

//Условия
standartNewPayTypeHeight(){
  if (this.filter.PAY_TYPE==='') 
    return true;
  else
    return false;
}

onNewPayTypeSelect(){
  this.showModalView("PAY_TYPE_ID", "условий");
}

onNewPayTypeClear(ev) { 
  this.filter.PAY_TYPE_ID = "";
  this.filter.PAY_TYPE = "";
  this.getPlist();
}

//НДС
onWithNDSSelect(selectedValue: any){
  this.getPlist();
}

onWithNDSClear(){
  this.filter.WITH_NDS = "";
}

//Валюта ТП
standartCcyTovHeight(){
  if (this.filter.TOV_CCY==='') 
    return true;
  else
    return false;
}

onCcyTovSelect(){
  this.showModalView("TOV_CCY_ID", "валюты ТП");
}

onCcyTovClear(ev) { 
  this.filter.TOV_CCY_ID = null;
  this.filter.TOV_CCY = "";
  this.getPlist();
}

//Категория ТП
onTovsCategoriesSelect(selectedValue: any){
  this.getPlist();
}

onTovsCategoriesClear(ev) { 
  this.filter.TOV_CATEGORY_ID = [];
}

//Отрасли
onSectorsSelect(selectedValue: any){
  this.getPlist();
}

onSectorsClear(ev) { 
  this.filter.SECTOR_ID = [];
}

//Дополнительно
onExtraSelect(selectedValue: any){
  this.getPlist();
}

onExtraClear(){
  this.filter.EXTRA = "";
}

//ТП
standartTovIdHeight(){
  if (this.filter.TOV_ID==='') 
    return true;
  else
    return false;
}

onTovIdSelect(){
  this.showModalView("TOV_ID", "ТП");
}

onTovIdClear(ev) { 
  this.filter.TOV_ID = null;
  this.filter.TOV_NAME = "";
  this.getPlist();
}

//ТПГ
standartTovsGroupHeight(){
  if (this.filter.TOV_GROUP_ID==='') 
    return true;
  else
    return false;
}

onTovsGroupSelect(){
  this.showModalView("TOV_GROUP_ID", "ТПГ");
}

onTovsGroupClear(ev) { 
  this.filter.TOV_GROUP_ID = null;
  this.filter.TOV_GROUP = "";
  this.getPlist();
}

//ВГП
standartProductHeight(){
  if (this.filter.PRODUCT_ID==='') 
    return true;
  else
    return false;
}

onProductSelect(){
  this.showModalView("PRODUCT_ID", "ВГП");
}

onProductClear(ev) { 
  this.filter.PRODUCT_ID = null;
  this.filter.PRODUCT = "";
  this.getPlist();
}


//ТПР
standartTovsProductHeight(){
  if (this.filter.TOV_PRODUCT_ID==='') 
    return true;
  else
    return false;
}

onTovsProductSelect(){
  this.showModalView("TOV_PRODUCT_ID", "ТПР");
}

onTovsProductClear(ev) { 
  this.filter.TOV_PRODUCT_ID = null;
  this.filter.TOV_PRODUCT = "";
  this.getPlist();
}

//Индикатор
onSignalSelect(selectedValue: any){
  this.getPlist();
}

onSignalClear(){
  this.filter.SIGNAL_ID = "";
}

//показ модальной формы с фильтром
  showModalView(key, keyText){
    let profileModal = this.modalCtrl.create(PriceFilterChoisePage, {
      key: key,
      keyText: keyText,
      filter: this.filter
    });
    profileModal.onDidDismiss(data => {
      if (data) {
        if (this.filter.PLIST_ID && this.filter.PLIST_ID != 30)
        {
          this.filter.PLIST_LEVEL_ID = "";
          this.filter.PLIST_LEVEL = "";
        }
        this.filter = data;
        this.getPlist();
      }
    });
    profileModal.present();
  }

  resetFilter(){
    let nf = new PriceProvider().filter;
    this.filter = nf;
    this.ionViewDidLoad();
    nf = null;
  }

  close(){
    this.viewCtrl.dismiss();
  }

  onSubmit() {
    this.viewCtrl.dismiss(this.filter);
  }

 }
