import { Injectable } from '@angular/core';
import { LoadingController } from 'ionic-angular';

@Injectable()
export class LoaderProvider {
  
  loader: any;

  constructor(public loadingCtrl: LoadingController) {
    
  }

  show(){
    this.loader = this.loadingCtrl.create({
      content: 'Пожалуйста подождите...'
    });
    this.loader.present();
  }

  hide(){
    setTimeout(() => {
        this.loader.dismiss();
    });
  }
}
