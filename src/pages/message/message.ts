import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { MessagesProvider } from '../../providers/messages/messages';

@Component({
  selector: 'page-message',
  templateUrl: 'message.html',
})
export class MessagePage {
  item: any;

  constructor(public navCtrl: NavController, 
    public navParams: NavParams, 
     public messageProvider: MessagesProvider 
      ) 
  {
    this.item = navParams.get('item');
  }

  ionViewWillEnter() {
     this.messageProvider.getUnreadCount(true);
  }

}
