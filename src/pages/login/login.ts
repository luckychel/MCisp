import { Component } from '@angular/core';
import { NavController, ToastController, LoadingController } from 'ionic-angular';

import { HomePage } from '../home/home';
import { Settings } from '../../providers/settings';
import { User } from '../../providers/user';

@Component({
  selector: 'page-login',
  templateUrl: 'login.html',
})
export class LoginPage {
  account: { username: string, password: string } = {
    username: '',
    password: ''
  };
  rememberme: boolean = false;
  loader: any;

  constructor(public navCtrl: NavController,
    public user: User,
    public settings: Settings,
    public toastCtrl: ToastController,
    public loadingCtrl: LoadingController) {

    this.settings.getAll()
      .then(settings => {
        this.account.username = settings["username"];
        this.account.password = settings["password"];
        this.rememberme = settings["rememberme"];
      });
  }

  ionViewDidLoad() {
    //console.log('ionViewDidLoad LoginPage');
  }

   doLogin() {
    
    if (!this.checkOnEmpty()) return;
    this.showLoader();
    this.user.login(this.account).subscribe((resp) => {
      if (this.rememberme)
      {
        this.settings.updateSettingsData({username:this.account.username});
        this.settings.updateSettingsData({username:this.account.password});
        this.settings.updateSettingsData({rememberme:this.rememberme});
      }
      this.hideLoader();
      this.navCtrl.setRoot(HomePage);
    }, (err) => {
     this.hideLoader();
     let toast = this.toastCtrl.create({
        message: "Невозможно войти. Пожалуйста проверьте информацию о Вашей учетной записи и попробуйте войти еще раз.",
        duration: 3000,
        position: 'top'
      });
      toast.present();
    });
  }

  checkOnEmpty(){
    let err: string = "";
    if (this.account.username === "") 
      err = "Заполните поле \"Логин\"";
    else if (this.account.password === "")
      err = "Заполните поле \"Пароль\"";
    if (err !== "")
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

  showLoader(){
    this.loader = this.loadingCtrl.create({
      content: 'Пожалуйста подождите...'
    });
    this.loader.present();
  }
  hideLoader(){
    setTimeout(() => {
        this.loader.dismiss();
    });
  }
}
