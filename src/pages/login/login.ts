import { Component } from '@angular/core';
import { Platform, NavController, AlertController, ToastController, LoadingController, MenuController } from 'ionic-angular';
import { Network } from '@ionic-native/network';

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
    public alertCtrl: AlertController,
    public toastCtrl: ToastController,
    public loadingCtrl: LoadingController, 
    public menuCtrl: MenuController,
    private network: Network,
    public user: User,
    public settings: Settings
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
    if (!this.checkNetworkConnection())
      return;
    
    if (!this.checkOnEmpty()) 
      return;

    this.showLoader();

    let us = this.user;

    us.login(this.account)
      .subscribe((res) => {
        
        this.settings.updateSettingsData({key:"username", value: us._user.userName});
        this.settings.updateSettingsData({key:"mol_id", value: us._user.molId})

        if (this.rememberme)
        {
          this.settings.updateSettingsData({key:"password", value: us._user.password});
          this.settings.updateSettingsData({key:"auth", value: us._user.isAuth});
          this.settings.updateSettingsData({key:"rememberme", value: this.rememberme});
        } 
        else
        {
          this.settings.updateSettingsData({key:"password", value:null});
          this.settings.updateSettingsData({key:"auth", value:"false"});
          this.settings.updateSettingsData({key:"rememberme", value:"false"});
        }

        this.settings.getAll()
        .then(settings => {

          console.log("mol_id = " + us._user.molId);
          console.log("registration_id = " + settings["registration_id"]);
          console.log("platform = " + (this.platform.is('android') ? 1 : 2));

          us.registration({
            MOL_ID: us._user.molId,
            REGISTRATION_ID: settings["registration_id"] || "",
            MOBILE_PLATFORM: (this.platform.is('android') ? 1 : 2)
          }).subscribe(()=>{
            console.log("registration_id updated in login.ts")

            this.hideLoader();
            
            if (us._user.isAuth) {
                this.navCtrl.setRoot(HomePage);
            }
            else {
              this.showToastr(us._user.authError);
            }
          },(err)=>{
            this.hideLoader();
          });
        });

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

  checkNetworkConnection():Boolean{
    
    var networkState = this.network.type.toUpperCase();
    var states = {};
    states["UNKNOWN"]  = 'Unknown connection';
    states["ETHERNET"] = 'Ethernet connection';
    states["WIFI"]     = 'WiFi connection';
    states["CELL_2G"]  = 'Cell 2G connection';
    states["CELL_3G"]  = 'Cell 3G connection';
    states["CELL_4G"]  = 'Cell 4G connection';
    states["CELL"]     = 'Cell generic connection';
    states["NONE"]     = 'No network connection';

    if (states[networkState] == "No network connection")
    {
      this.showToastr("Вы не подключены к сети интернет...")
      return false;
    }
    
    return true;
  }

}
