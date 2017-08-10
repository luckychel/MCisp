import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { BadgeProvider } from '../../providers/badge';


@Component({
  selector: 'page-message',
  templateUrl: 'message.html',
})
export class MessagePage {
  item: any;

  constructor(public navCtrl: NavController, 
    public navParams: NavParams, 
    public badgeProvider: BadgeProvider
      ) 
  {
    this.item = navParams.get('item');
  }

  ionViewWillEnter() {
    this.badgeProvider.unread();
  }

}
