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
    username: "",
    password: ""
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
    
    if (!this.checkOnEmpty()) 
      return;
    
    this.showLoader();

    let us = this.user;

    us.login(this.account).subscribe((res) => {
      
      if (this.rememberme)
      {
        this.settings.updateSettingsData({key:"username", value:us._user.username});
        this.settings.updateSettingsData({key:"password", value:us._user.password});
        this.settings.updateSettingsData({key:"auth", value:us._user.isAuth});
        this.settings.updateSettingsData({key:"rememberme", value:us._user.rememberme});
      }
      else
      {
        this.settings.updateSettingsData({key:"username", value:""});
        this.settings.updateSettingsData({key:"password", value:""});
        this.settings.updateSettingsData({key:"auth", value:"0"});
        this.settings.updateSettingsData({key:"rememberme",  value:"0"});
      }

      this.hideLoader();

      if (us._user.isAuth)
      {
         this.navCtrl.setRoot(HomePage);
      }
      else
      {
        this.showToastr(us._user.authError);
      }
    }, (err) => {
      this.hideLoader();
      this.showToastr("Ошибка при входе");
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
      this.showToastr(err);
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

  showToastr(message){
      let toast = this.toastCtrl.create({
        message: message,
        duration: 3000,
        position: 'top'
      });
      toast.present();
  }
}
