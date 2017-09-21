import { Injectable } from '@angular/core';
import { ToastController} from 'ionic-angular';

@Injectable()
export class ToastProvider {

  constructor(public toastCtrl: ToastController) {
    
  }

  show(message){
    let toast = this.toastCtrl.create({
      message: message,
      duration: 3000,
      position: 'top'
    });
    return Promise.resolve(toast.present());
  }

}
