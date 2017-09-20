import { Component } from '@angular/core';
import { Platform, NavController, MenuController } from 'ionic-angular';

import { HomePage } from '../home/home';
import { DbProvider } from '../../providers/db/db';
import { UserProvider } from '../../providers/user/user';
import { PushProvider } from '../../providers/push/push';

import { ToastProvider } from '../../providers/toast/toast';
import { LoaderProvider } from '../../providers/loader/loader';

@Component({
  selector: 'page-login',
  templateUrl: 'login.html',
})
export class LoginPage {
  
  loader: any;
  _user : any;

  account: { login: string, password: string, isRemember: boolean } = {
    login: "",
    password: "",
    isRemember: false
  };

  constructor(public platform: Platform,
    public navCtrl: NavController,
    private db: DbProvider, 
    private user: UserProvider,

    public menuCtrl: MenuController,
    public pushProvider: PushProvider,
    public toastProvider: ToastProvider,
    public loaderProvider: LoaderProvider) {
      this._user = user._user;
    }

  async ionViewWillEnter() {
    this.menuCtrl.enable(false, 'mainmenu');
   
    this.account.login = await this.db.getValue("login");
    this.account.password = await this.db.getValue("password");
    let r = await this.db.getValue("isRemember");
    this.account.isRemember = (r === "false" || r === false ? false : r === "" ? false : true);
  }

   doLogin() {

    if (!this.checkOnEmpty()) 
      return;

    this.loaderProvider.show();

    this.user.login(this.account)
      .then((res)=> {
        if (this.user._user.isAuth) 
        {
          this.pushProvider.setup(this._user.molId)
          .then(() => {
            this.navCtrl.setRoot(HomePage);
          });
        }
        else {
          this.toastProvider.show("Ошибка авторизации! " + this.user._user.authError);
        } 
        this.loaderProvider.hide();
      })
      .catch((err)=>{
        this.toastProvider.show("Ошибка авторизации! " + err.message);
        this.loaderProvider.hide();
      })
  }

  checkOnEmpty(){
    let err: string = "";
    if (this.account.login === "") 
      err = "Заполните поле \"Логин\"";
    else if (this.account.password === "")
      err = "Заполните поле \"Пароль\"";
    if (err !== "")
    {
      this.toastProvider.show(err);
      return false;
    }
    else 
      return true;
  }

}
