import { Injectable } from '@angular/core';
import { LoadingController } from 'ionic-angular';

@Injectable()
export class LoaderProvider {
  
  loader: any;

  constructor(public loadingCtrl: LoadingController) {
    
  }

  show(text = 'Пожалуйста, подождите...'){
    this.loader = this.loadingCtrl.create({
      spinner: 'ios',
      content: text
    });
    this.loader.present();
    return this.loader;
  }

  hide(loader?){
    if (loader)
      loader.dismiss();
    else
    {
      setTimeout(() => {
        this.loader.dismiss();
      });
    }
      
  }
}
