import { Component } from '@angular/core';
import { NavController, ToastController, LoadingController, MenuController } from 'ionic-angular';

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
    public loadingCtrl: LoadingController, 
    public menuCtrl: MenuController) {
      
    }

  ionViewWillEnter() {
    this.menuCtrl.enable(false, 'mainmenu');
   
    this.settings.getAll()
      .then(settings => {
        this.account.username = settings["username"];
        this.account.password = settings["password"];
        this.rememberme = settings["rememberme"];
      });
  }

   doLogin() {
    
    if (!this.checkOnEmpty()) 
      return;
    
    this.showLoader();

    let us = this.user;

    us.login(this.account).subscribe((res) => {
      
      this.settings.updateSettingsData({key:"username", value:us._user.userName});

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
