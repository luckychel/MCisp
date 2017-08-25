import { Component } from '@angular/core';
import { Platform, NavController, MenuController } from 'ionic-angular';

import { BadgeProvider } from '../../providers/badge';
import { MessagesProvider } from '../../providers/messages';
import { Settings } from '../../providers/settings';
import { User } from '../../providers/user';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {
  
  unread: number = 0;

  constructor(public platform: Platform,
    public navCtrl: NavController, 
    public menuCtrl: MenuController, 
    public badgeProvider: BadgeProvider, 
    public messageProvider: MessagesProvider,
    public user: User,
    public settings: Settings) {

  }
  
  ionViewWillEnter() {
    this.menuCtrl.enable(true, 'mainmenu');
    this.refreshMessagesUnread();
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
}
