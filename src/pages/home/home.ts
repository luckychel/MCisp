import { Component } from '@angular/core';
import { NavController, NavParams, MenuController } from 'ionic-angular';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {

  constructor(public navCtrl: NavController, public menuCtrl: MenuController, navParams: NavParams) {
    console.log(navParams)
  }
  
  ionViewWillEnter() {
    this.menuCtrl.enable(true, 'mainmenu');

  }
}
