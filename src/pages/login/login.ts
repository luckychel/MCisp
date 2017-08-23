import { Component } from '@angular/core';
import { Platform, NavController, ToastController, LoadingController, MenuController } from 'ionic-angular';

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
  registration_id: string = "";
  loader: any;

  constructor(public platform: Platform,
    public navCtrl: NavController,
    public user: User,
    public settings: Settings,
    public toastCtrl: ToastController,
    public loadingCtrl: LoadingController, 
    public menuCtrl: MenuController
    ) {
      
    }

  ionViewWillEnter() {
    this.menuCtrl.enable(false, 'mainmenu');
   
    this.settings.getAll()
      .then(settings => {
        this.account.username = settings["username"];
        this.account.password = settings["password"];
        this.rememberme = settings["rememberme"];
        this.registration_id = settings["registration_id"];
      });
  }

   doLogin() {

    if (!this.checkOnEmpty()) 
      return;

    this.showLoader();

    let us = this.user;

    us.login(this.account)
      .subscribe((res) => {

        this.settings.updateSettingsData({key:"username", value:us._user.userName});
        this.settings.updateSettingsData({key:"mol_id", value:us._user.molId})

        if (this.rememberme)
        {
          this.settings.updateSettingsData({key:"password", value:us._user.password});
          this.settings.updateSettingsData({key:"auth", value:us._user.isAuth});
          this.settings.updateSettingsData({key:"rememberme", value:this.rememberme});
        }
        else
        {
          this.settings.updateSettingsData({key:"password", value:null});
          this.settings.updateSettingsData({key:"auth", value:"false"});
          this.settings.updateSettingsData({key:"rememberme", value:"false"});
        }

        this.hideLoader();

        if (us._user.isAuth) {
          us.registration({
            MOL_ID: us._user.molId,
            REGISTRATION_ID: this.registration_id,
            MOBILE_PLATFORM: (this.platform.is('android') ? 1 : 2)
          }).subscribe((res) => {
            this.navCtrl.setRoot(HomePage);
          });
        }
        else {
          this.showToastr(us._user.authError);
        }
    }, (err) => {
      this.hideLoader();
      this.showToastr("Ошибка авторизации! " + err);
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
