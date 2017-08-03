import { Component } from '@angular/core';
import { NavController, ToastController } from 'ionic-angular';

import { HomePage } from '../home/home';

import { User } from '../../providers/user';

@Component({
  selector: 'page-login',
  templateUrl: 'login.html',
})
export class LoginPage {
  account: { email: string, password: string } = {
    email: '',
    password: ''
  };

  constructor(public navCtrl: NavController,
    public user: User,
    public toastCtrl: ToastController) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad LoginPage');
  }

   doLogin() {
    
    if (!this.checkOnEmpty()) return;

    this.user.login(this.account).subscribe((resp) => {
      this.navCtrl.push(HomePage);
    }, (err) => {
     
      // Unable to log in
      let toast = this.toastCtrl.create({
        message: "Невозможно войти. Пожалуйста проверьте информацию о Вашей учетной записи и попробуйте войти еще раз.",
        duration: 3000,
        position: 'top'
      });
      toast.present();
    });
  }

  checkOnEmpty(){
    let err: string;
    if (this.account.email === "") 
      err = "Заполните поле \"Логин\"";
    else if (this.account.password === "")
      err = "Заполните поле \"Пароль\"";
    if (err.length > 0)
    {
      let toast = this.toastCtrl.create({
        message: err,
        duration: 3000,
        position: 'top'
      });
      toast.present();
      return false;
    }
    else 
      return true;
  }

}
