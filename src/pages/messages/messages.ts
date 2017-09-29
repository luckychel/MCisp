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
  loader: any;
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
          for (let item of data) {
            /* console.log("Сообщения: " + JSON.stringify(item)); */
            this.items.push(item);
          }
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
    this.setRead(item, undefined).then(()=>{
      this.navCtrl.push(MessagePage, {
        item: item
      });
    });
  }

  setRead(p, slidingItem) {

    if (slidingItem !== undefined) {
      slidingItem.close();
    }     

    return this.messageProvider.setRead({HIST_ID: p.hisT_ID})
    .then((res)=>{
      for (var i = 0; i< this.items.length; i++) {
        if (this.items[i]["hisT_ID"] == p.hisT_ID)
        {
          this.items[i]["d_READ"] = new Date().getDate();
          break;  
        }
      }
    })
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

    return this.messageProvider.setUnread({HIST_ID: p.hisT_ID})
      .then((res)=>{
          for (var i = 0; i< this.items.length; i++) {
            if (this.items[i]["hisT_ID"] == p.hisT_ID)
            {
              this.items[i]["d_READ"] = null;
              break;  
            }
          }
      })
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
            this.messageProvider.setDelete({HIST_ID: p.hisT_ID})
              .then((res)=>{
                for (var i = 0; i< this.items.length; i++) {
                  if (this.items[i]["hisT_ID"] == p.hisT_ID)
                  {
                    this.items.splice(i, 1);
                    break;  
                  }
                }
              })
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

