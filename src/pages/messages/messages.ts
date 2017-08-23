import { Component } from '@angular/core';
import { NavController, AlertController, NavParams, MenuController, LoadingController } from 'ionic-angular';
import { MessagePage } from '../message/message';
/* import { Item } from '../../models/item'; */

import { Api } from '../../providers/api';
import { Settings } from '../../providers/settings';
import { BadgeProvider } from '../../providers/badge';
import { MessagesProvider } from '../../providers/messages';

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
    public loadingCtrl: LoadingController, 
    public settings: Settings, 
    public api: Api, 
    public badgeProvider: BadgeProvider, 
    public messageProvider: MessagesProvider) {
  }

  getData(){
    this.showLoader()
    this.items = [];
    this.messageProvider.getMessages()
      .then((res)=>{
        res.subscribe((data)=>{
          if (res!== undefined && data.length > 0) {
            for (let item of data) {
              this.items.push(item);
            }
          }
          this.hideLoader();
        }, (err)=>{
          alert(err);
        })
    })
    .then(()=>{
      this.refreshMessagesUnread();
    }).catch((err)=>{
      alert(err);
    });
  }

  ionViewWillEnter() {
    this.menuCtrl.enable(true, 'mainmenu');
    this.getData();
  }

  refreshMessagesUnread(){
    this.messageProvider.getUnreadCount()
    .then((res)=>{
      res.subscribe((data)=>{
        this.unread = parseInt(data);
        this.badgeProvider.updateCnt(this.unread);
      }, (err)=>{
        alert(err);
      });
    }).catch((err)=>{
      alert(err);
    });
  }

   doRefresh(refresher) {
    setTimeout(() => {
      this.getData();
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

    this.api.post("messages/setread", {HIST_ID: p.hisT_ID})
      .map(res => {
        return res.json()
      })
      .subscribe((res)=>{
          for (var i = 0; i< this.items.length; i++) {
            if (this.items[i]["hisT_ID"] == p.hisT_ID)
            {
              this.items[i]["d_READ"] = new Date().getDate();
              break;  
            }
          }
          this.refreshMessagesUnread();
      }, (err)=>{
        alert(err);
      });
  }

  setUnread(p, slidingItem) {
    
    if (slidingItem !== undefined) {
      slidingItem.close();
    }     

    this.api.post("messages/setunread", {HIST_ID: p.hisT_ID})
      .map(res => {
        return res.json()
      })
      .subscribe((res)=>{
          for (var i = 0; i< this.items.length; i++) {
            if (this.items[i]["hisT_ID"] == p.hisT_ID)
            {
              this.items[i]["d_READ"] = null;
              break;  
            }
          }
          this.refreshMessagesUnread();
      }, (err)=>{
        alert(err);
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
            this.api.post("messages/setdelete", {HIST_ID: p.hisT_ID})
              .map(res => {
                return res.json()
              })
              .subscribe((res)=>{
                  for (var i = 0; i< this.items.length; i++) {
                    if (this.items[i]["hisT_ID"] == p.hisT_ID)
                    {
                      this.items.splice(i, 1);
                      break;  
                    }
                  }
                  this.refreshMessagesUnread();
              }, (err)=>{
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
      ]
    });
    alert.present();
  }

  showLoader(){
    this.loader = this.loadingCtrl.create({
      content: 'Пожалуйста подождите...'
    });
    this.loader.present();
  }

  hideLoader(){
    setTimeout(() => {
        this.loader.dismiss();
    });
  }
}

