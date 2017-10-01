import { Component } from '@angular/core';
import { Platform, NavController, NavParams, MenuController } from 'ionic-angular';
import { PriceFilterPage } from '../price-filter/price-filter';

import { MessagesProvider } from '../../providers/messages/messages';

@Component({
  selector: 'page-price',
  templateUrl: 'price.html',
})
export class PricePage {
  unread: number = 0;

  constructor(public platform: Platform,
    public navCtrl: NavController, 
    public navParams: NavParams,
    public menuCtrl: MenuController, 
    public messagesProvider: MessagesProvider) {

  }
  
  ionViewWillEnter() {
    this.menuCtrl.enable(true, 'mainmenu');
    this.refreshMessagesUnread();
  }

  async refreshMessagesUnread(){
    this.unread = await this.messagesProvider.getUnreadCount(true)
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad PricePage');
  }

  clickFind(e){
    this.navCtrl.push(PriceFilterPage)
  }
}
