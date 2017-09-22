import { Component } from '@angular/core';
import { NavController, NavParams, MenuController, AlertController } from 'ionic-angular';
import { MessagePage } from '../message/message';
/* import { Item } from '../../models/item'; */

import { DbProvider } from '../../providers/db/db';
import { MessagesProvider } from '../../providers/messages/messages';
import { LoaderProvider } from '../../providers/loader/loader';

@Component({
  selector: 'page-messages',
  templateUrl: 'messages.html',
})
export class MessagesPage {

  items: any[] = [];
  loader: any;
  unread: number = 0;

  constructor(public navCtrl: NavController, 
    public navParams: NavParams, 
    public menuCtrl: MenuController, 
    public alertCtrl: AlertController,

    public db: DbProvider,  
    public messageProvider: MessagesProvider,
    public loaderProvider: LoaderProvider) {
  }

  getData(isLoader = true){
    if (isLoader) this.loaderProvider.show();
    this.items = [];
    this.messageProvider.getMessages()
      .then((data)=>{
        if (data!== undefined && data.length > 0) {
          for (let item of data) {
            this.items.push(item);
          }
        }
        if (isLoader) this.loaderProvider.hide();
    })
    .then(()=>{
      this.messageProvider.getUnreadCount(true).then((res)=>{this.unread = res;});
    }).catch((err)=>{
      if (isLoader) this.loaderProvider.hide();
    });
  }

  ionViewWillEnter() {
    this.menuCtrl.enable(true, 'mainmenu');
    this.getData();
  }

   doRefresh(refresher) {
    setTimeout(() => {
      this.getData(false);
      refresher.complete();
    }, 2000);
  }

  openItem(item) {
    this.setRead(item, undefined);
    this.navCtrl.push(MessagePage, {
      item: item
    });
  }

  setRead(p, slidingItem) {

    if (slidingItem !== undefined) {
      slidingItem.close();
    }     

    this.messageProvider.setRead({HIST_ID: p.hisT_ID})
    .then((res)=>{
      for (var i = 0; i< this.items.length; i++) {
        if (this.items[i]["hisT_ID"] == p.hisT_ID)
        {
          this.items[i]["d_READ"] = new Date().getDate();
          break;  
        }
      }
      this.messageProvider.getUnreadCount(true).then((res)=>{this.unread = res;});
    });
    
  }

  setUnread(p, slidingItem) {
    
    if (slidingItem !== undefined) {
      slidingItem.close();
    }     

    this.messageProvider.setUnread({HIST_ID: p.hisT_ID})
      .then((res)=>{
          for (var i = 0; i< this.items.length; i++) {
            if (this.items[i]["hisT_ID"] == p.hisT_ID)
            {
              this.items[i]["d_READ"] = null;
              break;  
            }
          }
          this.messageProvider.getUnreadCount(true).then((res)=>{this.unread = res;});
      }); 
  }

  setDelete(p, slidingItem) {

    let alert = this.alertCtrl.create({
      title: "Предупреждение",
      message: "Удалить сообщение?",
      buttons: [
        {
          text: "OK",
          handler: () => {
            slidingItem.close();
            this.messageProvider.setDelete({HIST_ID: p.hisT_ID})
              .then((res)=>{
                for (var i = 0; i< this.items.length; i++) {
                  if (this.items[i]["hisT_ID"] == p.hisT_ID)
                  {
                    this.items.splice(i, 1);
                    break;  
                  }
                }
                this.messageProvider.getUnreadCount(true).then((res)=>{this.unread = res;});
              }); 
          }
        },
        {
          text: "Отмена",
          role: 'cancel',
          handler: () => {
            slidingItem.close();
          }
        }
      ],
      cssClass: "warningCustomCss"
    });
    alert.present();
  }

}

