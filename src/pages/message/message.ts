import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { MessagesProvider } from '../../providers/messages/messages';
import { ToastProvider } from '../../providers/toast/toast';

@Component({
  selector: 'page-message',
  templateUrl: 'message.html',
})
export class MessagePage {
  item: any;

  constructor(public navCtrl: NavController, 
    public navParams: NavParams, 
     public messageProvider: MessagesProvider,
     public toastProvider: ToastProvider
      ) 
  {
    this.item = navParams.get('item');
  }

  ionViewWillEnter() {
     this.messageProvider.getUnreadCount(true)
     .catch((err)=>{
        if (err.message) {
          this.toastProvider.show(err.message);
        }
      });
  }

}
