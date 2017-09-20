import { Injectable } from '@angular/core';
import { AlertController } from 'ionic-angular';

@Injectable()
export class AlertProvider {

  constructor(public alertCtrl: AlertController) {

  }

  show(notification) {
    let alert = this.alertCtrl.create({
      title: notification.title,
      subTitle: notification.message,
      buttons: [
      {
        text: 'OK',
        role: 'cancel',
        handler: () => {
          //this.messagesProvider.getUnreadCount(true);
        }
      }
    ],
    cssClass: 'alertCustomCss'
    });
    alert.present();
  }
}
