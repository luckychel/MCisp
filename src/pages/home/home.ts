import { Component } from '@angular/core';
import { Platform, NavController, MenuController } from 'ionic-angular';

import { MessagesProvider } from '../../providers/messages/messages';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {
  
  unread: number = 0;
  /* reg: boolean = false; */

  constructor(public platform: Platform,
    public navCtrl: NavController, 
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

  /*
    toggleReg(){ 
    this.reg = !this.reg;
    this.events.publish('user:registrationId', this.reg);
  } */
}
