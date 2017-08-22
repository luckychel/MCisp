import { Component } from '@angular/core';
import { NavController, MenuController } from 'ionic-angular';
import { MessagesProvider } from '../../providers/messages';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {
  
  unread: number = 0;

  constructor(public navCtrl: NavController, 
    public menuCtrl: MenuController, 
    public messageProvider: MessagesProvider) {

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
      }, (err)=>{
        alert(err);
      });
    }).catch((err)=>{
      alert(err);
    });
  }
}
