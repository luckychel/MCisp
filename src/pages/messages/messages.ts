import { Component } from '@angular/core';
import { NavController, NavParams, MenuController, AlertController } from 'ionic-angular';
import { MessagePage } from '../message/message';
/* import { Item } from '../../models/item'; */

import { DbProvider } from '../../providers/db/db';
import { MessagesProvider } from '../../providers/messages/messages';
import { LoaderProvider } from '../../providers/loader/loader';
import { ToastProvider } from '../../providers/toast/toast';

@Component({
  selector: 'page-messages',
  templateUrl: 'messages.html',
})
export class MessagesPage {

  items: any[] = [];
  items1: any[] = [];
  unread: number = 0;

  constructor(public navCtrl: NavController, 
    public navParams: NavParams, 
    public menuCtrl: MenuController, 
    public alertCtrl: AlertController,

    public db: DbProvider,  
    public messageProvider: MessagesProvider,
    public loaderProvider: LoaderProvider,
  public toastProvider: ToastProvider) {
  }

  getData(isLoader = true){
    if (isLoader) this.loaderProvider.show();
    this.items = [];
    this.messageProvider.getMessages()
      .then((data)=>{
        if (data!== undefined && data.length > 0) {
          /* for (let item of data) {
            this.items.push(item);
          } */
          this.items1 = data;
          this.items = data.slice(0,30);

        }
        if (isLoader) this.loaderProvider.hide();
    })
    .then(()=>{
      this.messageProvider.getUnreadCount(true).then((res)=>{this.unread = res;});
    }).catch((err)=>{
      if (isLoader) 
        this.loaderProvider.hide();
        if (err.message) {
          this.toastProvider.show(err.message);
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

  ionViewWillEnter(){
    this.menuCtrl.enable(true, 'mainmenu');
  }

  ionViewDidLoad() {
    //console.log("зашли:" + new Date().toLocaleTimeString())
    this.getData();
    //console.log("вышли:" + new Date().toLocaleTimeString())
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

    for (var i = 0; i< this.items.length; i++) {
      if (this.items[i]["hisT_ID"] == p.hisT_ID)
      {
        this.items[i]["d_READ"] = new Date().getDate();
        break;  
      }
    }

    return this.messageProvider.setRead({HIST_ID: p.hisT_ID})
    .then(() => this.messageProvider.getUnreadCount(true).then((res)=>{this.unread = res;}))
    .catch((err)=>{
      if (err.message) {
        this.toastProvider.show(err.message);
      }
    });
  }

  setUnread(p, slidingItem) {
    
    if (slidingItem !== undefined) {
      slidingItem.close();
    }     
    for (var i = 0; i< this.items.length; i++) {
      if (this.items[i]["hisT_ID"] == p.hisT_ID)
      {
        this.items[i]["d_READ"] = null;
        break;  
      }
    }

    return this.messageProvider.setUnread({HIST_ID: p.hisT_ID})
      .then(() => this.messageProvider.getUnreadCount(true).then((res)=>{this.unread = res;}))
      .catch((err)=>{
        if (err.message) {
          this.toastProvider.show(err.message);
        }
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

            for (var i = 0; i< this.items.length; i++) {
              if (this.items[i]["hisT_ID"] == p.hisT_ID)
              {
                this.items.splice(i, 1);
                break;  
              }
            }

            this.messageProvider.setDelete({HIST_ID: p.hisT_ID})
              .then(() => this.messageProvider.getUnreadCount(true).then((res)=>{this.unread = res;}))
              .catch((err)=>{
                if (err.message) {
                  this.toastProvider.show(err.message);
                }
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

