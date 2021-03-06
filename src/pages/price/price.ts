import { Component, ViewChild } from '@angular/core';
import { Platform, NavController, NavParams, MenuController, ModalController, Searchbar } from 'ionic-angular';
import { PriceFilterPage } from '../price-filter/price-filter';

import { LoaderProvider } from '../../providers/loader/loader';
import { MessagesProvider } from '../../providers/messages/messages';
import { PriceProvider } from '../../providers/price/price';

@Component({
  selector: 'page-price',
  templateUrl: 'price.html',
})
export class PricePage {
  unread: number = 0;
  items: any;
  filter: any;
  args: any;
  spinner: boolean = false;

  @ViewChild('searchBar') searchbar: Searchbar;

  constructor(public platform: Platform,
    public navCtrl: NavController, 
    public navParams: NavParams,
    public menuCtrl: MenuController, 
    public priceService: PriceProvider,
    public messagesProvider: MessagesProvider,
    public loadingCtrl: LoaderProvider,
    public modalCtrl: ModalController) {
      
      this.filter = this.priceService.filter;
      this.args = this.priceService.args;
      this.items = [];
      
  }
  
  ionViewWillEnter() {
    this.menuCtrl.enable(true, 'mainmenu');
    this.refreshMessagesUnread();
  }

  async refreshMessagesUnread(){
    this.unread = await this.messagesProvider.getUnreadCount(true)
  }

  //список фильров по умолчанию
  ionViewDidLoad(){
    this.getPlistData(true, true);
  }

  async getPlistData(dflt = true, showLoader = true){
    if (dflt)
    {
      let loader = this.loadingCtrl.show();
      let dfilter = await this.priceService.getPlistsFilter()
        .then((dfilter)=> {
          this.loadingCtrl.hide(loader);
          return dfilter;
      }).catch((err)=>{
          this.loadingCtrl.hide(loader);
      });

      this.filter.BUNK_ID = dfilter.BUNK_ID;
      this.filter.BUNKTOV_DEPT_ID = dfilter.BUNKTOV_DEPT_ID,
      this.filter.PLIST_ID = dfilter.PLIST_ID;
      this.filter.CCY_ID = dfilter.CCY_ID;
      this.filter.PAY_TYPE_ID = dfilter.PAY_TYPE_ID;
    }
    if (showLoader) this.spinner = true;
    return await this.priceService.getPlistData(this.filter, this.args, false)
      .then((res) => {
        if (res)
        {
          for (var i = 0; i < res.plist.length; i++) {
            //console.log(res.plist[i]);
            this.items.push(res.plist[i]);
          }
          this.args = res.args;
        }
        if (showLoader) this.spinner = false;
      }).catch(()=>{
        if (showLoader) this.spinner = false;
      });
  }
  
  doInfinite(): Promise<any> {

    return new Promise((resolve) => {
      setTimeout(async () => {
        this.args.StartRowIndex = parseInt(this.args.StartRowIndex) + parseInt(this.args.MaximumRows);
        await this.getPlistData(false, false);
        resolve();
      }, 500);
    })
  }

  clickFind(e){

    let profileModal = this.modalCtrl.create(PriceFilterPage, {
      filter: this.filter
    });
    profileModal.onDidDismiss(data => {
      if (data) {
        if (this.filter.PLIST_ID && this.filter.PLIST_ID != 30)
        {
          this.filter.PLIST_LEVEL_ID = "";
          this.filter.PLIST_LEVEL = "";
        }
        this.items = [];
        let nf = new PriceProvider().args;
        this.args = nf;
        this.filter = data;
        this.getPlistData(false, true);
        nf = null;
      }
    });
    profileModal.present();

  }

  async onRefresh(ev, clear){
    if (clear) this.filter.TOV = '';
    this.items = [];
    let nf = new PriceProvider().args;
    this.args = nf;
    await this.getPlistData(false, true);
    nf = null;
    this.searchbar.setFocus();
  }

  showAllInfo(item, i)
  {
    if (item.VISIBLE)
      item.VISIBLE = !item.VISIBLE;
    else
      item.VISIBLE = 1;
  }
}
