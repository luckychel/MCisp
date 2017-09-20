import { Component, ViewChild } from '@angular/core';
import { Nav, Platform, Events } from 'ionic-angular';

import { AppVersion } from '@ionic-native/app-version';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { HeaderColor } from '@ionic-native/header-color';

import { LoginPage} from '../pages/login/login';
import { HomePage } from '../pages/home/home';
import { MessagesPage } from '../pages/messages/messages';
/* import { MessagePage } from '../pages/message/message'; */

import { DbProvider } from '../providers/db/db';
import { UserProvider } from '../providers/user/user';
import { MessagesProvider } from '../providers/messages/messages';
import { PushProvider } from '../providers/push/push';
import { LoaderProvider } from '../providers/loader/loader';
import { ToastProvider } from '../providers/toast/toast';

/* import { MyAppProvider } from '../providers/my-app/my-app'; */

import { DomSanitizer} from '@angular/platform-browser';

@Component({
  templateUrl: 'app.html',
/*   providers: [MyAppProvider]   */ 
})
export class MyApp {
  @ViewChild(Nav) nav: Nav;

  version: any;
  rootPage: any = null;
  _user : any;
  pages: Array<{title: string, component: any}>;
  registrationId: boolean = false;

  constructor(public platform: Platform, 
    public statusBar: StatusBar, 
    public splashScreen: SplashScreen, 
    public headerColor: HeaderColor, 
    public appVersion: AppVersion,
    public events: Events,

    public loaderProvider: LoaderProvider,
    public toastProvider: ToastProvider, 

    public db: DbProvider, 
    public user: UserProvider,
    public messagesProvider: MessagesProvider,
    public pushProvider: PushProvider,
    public dom: DomSanitizer,
  )
    {
      //Наполнение меню
       this.pages = [
          { title: 'Главная', component: HomePage },
          { title: 'Сообщения', component: MessagesPage }
        ];

      this.initializeApp();

    }

  initializeApp() {
    this.platform.ready().then(() => {

      this.headerColor.tint('#4d7198');

      //android
      if (this.platform.is('android')) {
        this.statusBar.backgroundColorByHexString("#4d7198");
      } else { //ios
        this.statusBar.backgroundColorByName("blue");
      }

      this.splashScreen.hide();

      if (this.platform.is('cordova')) {
        this.appVersion.getVersionNumber().then((res)=>{ this.version = res});
      } else {
        this.version = "<тест>";
      }

      //вешаем событие на изменение индикатора push
      this.events.subscribe('user:registrationId', (val) => {
        this.registrationId = val;
      });

      this._user = this.user._user;
      
      this.getDbData().then(()=>{

      /*   console.log("serverToken: " + this._user.serverToken); 
        console.log("login: " + this._user.login);
        console.log("password: " + this._user.password);
        console.log("molId: " + this._user.molId);
        console.log("molName: " + this._user.molName); 
        console.log("isAuth: " + this._user.isAuth); 
 */
        //вход с токеном
        if (this._user.serverToken !== "" && this._user.isRemember && this._user.isAuth)
        {
          //console.log("проверка токена: " + this._user.serverToken); 
          //проверка
          this.user.checkToken().then(() => {

            //если токен валидный пускаем
            this.pushProvider.setup(this._user.molId)
            .then(()=> {
              this.setRootPage(HomePage);
            });
           
          }).catch((err)=>{
            this.toastProvider.show(err.message);
            this.setRootPage(LoginPage);
          });
        }
        else {
          this.setRootPage(LoginPage);
        }
      }).catch((err)=>{
        this.toastProvider.show(err.message);
      })
    });
  }

  openPage(page) {
    this.nav.setRoot(page.component);
  }

  setRootPage(page: any) {
    this.rootPage = page;
  }

  getDbData(){
    let asyncTask = new Promise((resolve, reject) => {
      try {
        let t1 = this.db.getValue("login").then((res) => this._user.login = res);
        let t2 = this.db.getValue("password").then((res) => this._user.password = res);
        let t3 = this.db.getValue("molId").then((res) => this._user.molId = res);
        let t4 = this.db.getValue("molName").then((res) => this._user.molName = res);
        let t5 = this.db.getValue("molPhoto").then((res) => this._user.molPhoto = res);
        let t6 = this.db.getValue("isAuth").then((res) => this._user.isAuth = res);
        let t7 = this.db.getValue("isRemember").then((res) => this._user.isRemember = res);
        let t8 = this.db.getValue("serverToken").then((res) => this._user.serverToken = res);
        return Promise.all([t1, t2, t3, t4, t5, t6, t7, t8])
        .then(()=> resolve(true))
        .catch((err)=> reject(new Error('Ошибка сохранения данных в таблицу настроек ' + err.message)));
      }
      catch (err){
        reject(new Error('Ошибка получения таблицы настроек ' + err.message));
      }
    });
    return asyncTask;
  }

  
  logout(){
      this.loaderProvider.show();
      return this.db.setValue('isAuth', false)
        .then(()=>{
          return this.db.getValue('registrationId');
        }).then((res)=>{
          return this.user.unregistration({REGISTRATION_ID : res})
        }).then(()=>{
          this.loaderProvider.hide();
          this.nav.setRoot(LoginPage);
          //window.location.reload();
        })
        .catch((err)=>{
          this.loaderProvider.hide();
          new Error(err.message)
        });
  }
  
}
