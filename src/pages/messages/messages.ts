import { Component } from '@angular/core';
import { NavController, AlertController, NavParams, MenuController } from 'ionic-angular';
import { MessagePage } from '../message/message';
import { Item } from '../../models/item';

import { Api } from '../../providers/api';
import { Settings } from '../../providers/settings';

@Component({
  selector: 'page-messages',
  templateUrl: 'messages.html',
})
export class MessagesPage {

  items: Item[] = [];

  constructor(public navCtrl: NavController, 
    public navParams: NavParams, 
    public menuCtrl: MenuController, 
    public alertCtrl: AlertController,
    public settings: Settings, 
    public api: Api) {

   /*  debugger
    this.items = [
      new Item("Burt Bear", "assets/img/speakers/bear.jpg", "Burt is a Bear."),
      new Item("Charlie Cheetah", "assets/img/speakers/cheetah.jpg", "Charlie is a Cheetah."),
      new Item("Donald Duck", "assets/img/speakers/duck.jpg", "Donald is a Duck."),
      new Item("Eva Eagle", "assets/img/speakers/eagle.jpg", "Eva is an Eagle."),
      new Item("Ellie Elephant", "assets/img/speakers/elephant.jpg", "Ellie is an Elephant."),
      new Item("Molly Mouse", "assets/img/speakers/mouse.jpg", "Molly is a Mouse."),
      new Item("Paul Puppy", "assets/img/speakers/puppy.jpg", "Paul is a Puppy.")
    ];

    for (let item of this.items) {
      this.items.push(item);
    }
 */
  }

  getData(){
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

    this.api.post("messages/setread", {ID: p.id})
      .map(res => {
        return res.json()
      })
      .subscribe((res)=>{
          for (var i = 0; i< this.items.length; i++) {
            if (this.items[i]["id"] == p.id)
            {
              this.items[i]["iS_READ"] = "true";
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
            this.api.post("messages/setdelete", {ID: p.id})
              .map(res => {
                return res.json()
              })
              .subscribe((res)=>{
                  for (var i = 0; i< this.items.length; i++) {
                    if (this.items[i]["id"] == p.id)
                    {
                      this.items.splice(i, 1);
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

}

