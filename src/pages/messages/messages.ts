import { Component } from '@angular/core';
import { NavController, AlertController, NavParams, MenuController, LoadingController } from 'ionic-angular';
import { MessagePage } from '../message/message';
import { Item } from '../../models/item';

import { Api } from '../../providers/api';
import { Settings } from '../../providers/settings';
import { BadgeProvider } from '../../providers/badge';

@Component({
  selector: 'page-messages',
  templateUrl: 'messages.html',
})
export class MessagesPage {

  items: Item[] = [];
  loader: any;

  constructor(public navCtrl: NavController, 
    public navParams: NavParams, 
    public menuCtrl: MenuController, 
    public alertCtrl: AlertController,
    public loadingCtrl: LoadingController, 
    public settings: Settings, 
    public api: Api, 
    public badgeProvider: BadgeProvider) {
  }

  getData(){
    this.showLoader()
    this.items = [];
    this.settings.getValue("mol_id")
        .then((res) => {
            this.api.get("messages/" + res)
              .map(res => {
                return res.json()
              })
              .subscribe((res)=>{
                if (res !== undefined && res.length > 0)
                {
                  for (let item of res) {
                    this.items.push(item);
                  }
                }
                this.hideLoader();
              }, (err) =>{
                this.hideLoader();
              });
      });
  }

  ionViewWillEnter() {
    this.menuCtrl.enable(true, 'mainmenu');
    this.getData();
  }

   doRefresh(refresher) {
    setTimeout(() => {
      this.getData();
      refresher.complete();
    }, 2000);
  }

  openItem(item) {
    this.setread(item, undefined);
    this.navCtrl.push(MessagePage, {
      item: item
    });
  }

  setread(p, slidingItem) {
    if (slidingItem !== undefined) {
      slidingItem.close();
    }     

    this.api.post("messages/setread", {MESSAGE_ID: p.messagE_ID})
      .map(res => {
        return res.json()
      })
      .subscribe((res)=>{
          for (var i = 0; i< this.items.length; i++) {
            if (this.items[i]["messagE_ID"] == p.messagE_ID)
            {
              this.items[i]["d_READ"] = new Date().getDate();
              this.badgeProvider.unread();
              break;  
            }
          }
      });
  }

  setdelete(p, slidingItem) {
    let alert = this.alertCtrl.create({
      title: "Предупреждение",
      message: "Удалить сообщение?",
      buttons: [
        {
          text: "OK",
          handler: () => {
            slidingItem.close();
            this.api.post("messages/setdelete", {MESSAGE_ID: p.messagE_ID})
              .map(res => {
                return res.json()
              })
              .subscribe((res)=>{
                  for (var i = 0; i< this.items.length; i++) {
                    if (this.items[i]["messagE_ID"] == p.messagE_ID)
                    {
                      this.items.splice(i, 1);
                      this.badgeProvider.unread();
                      break;  
                    }
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

