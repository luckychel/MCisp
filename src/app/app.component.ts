import { Component, ViewChild } from '@angular/core';
import { Nav, Platform, AlertController, LoadingController} from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { Push, PushObject, PushOptions } from '@ionic-native/push';
import { HeaderColor } from '@ionic-native/header-color';
/* import { Storage } from '@ionic/storage'; */

import { LoginPage} from '../pages/login/login';
import { HomePage } from '../pages/home/home';
import { MessagesPage } from '../pages/messages/messages';
import { MessagePage } from '../pages/message/message';

import { Api } from '../providers/api';
import { Settings } from '../providers/settings';
import { User } from '../providers/user';
import { BadgeProvider } from '../providers/badge';

@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  @ViewChild(Nav) nav: Nav;

  rootPage: any = null;
  loader: any;
  pages: Array<{title: string, component: any}>;

  registrationId: any;
  login = {
    exprireDate: ""
  };

  constructor(public platform: Platform, 
    public statusBar: StatusBar, 
    public splashScreen: SplashScreen, 
    public headerColor: HeaderColor, 
    public settings:Settings, 
    public push: Push, 
    public alertCtrl: AlertController,
    public loadingCtrl: LoadingController, 
    public api: Api,
    public user: User,
    public badgeProvider: BadgeProvider,
  /*   private storage: Storage */
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
        // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      this.headerColor.tint('#4d7198');

      if (this.platform.is('android')) {
        this.statusBar.backgroundColorByHexString("#4d7198");
      } else { //ios
        this.statusBar.backgroundColorByName("blue");
      }
      
     // this.storage.set('login', null);
      /*      this.storage.get('login').then((res)=>{
            if (res != null) {
              this.login = JSON.parse(res);
              let d1 = new Date(this.login.exprireDate).getTime();
              let d2 = new Date().getTime();
              let diff = new Date(d2 - d1);
              let y = (diff.getUTCFullYear() - 1970);
              let m = diff.getUTCMonth();
              let d = diff.getUTCDate() - 1;
              if (y > 0 || (y == 0 && m > 0) || (y == 0 && m == 0 && d > 2))
              {
                  this.nav.setRoot(LoginPage);
              }
              else
              {
                this.login.exprireDate = new Date().toString(); 
                this.storage.set('login', JSON.stringify(this.login));
              }
            }
            else {
              this.login.exprireDate = new Date().toString(); 
              this.storage.set('login', JSON.stringify(this.login));
            }
          });
      */

      this.settings.openDatabase()
        .then(() => {
          this.splashScreen.hide();
        })
        .then(() => {
           this.pushSetup()
           .then(()=>{
              this.checkAuth().then((res)=>{
                if (!res) {
                  this.rootPage = LoginPage;
                }
                else
                {
                  this.rootPage = HomePage;
                }
              });
          })
        })
    });
  }

  openPage(page) {
    this.nav.setRoot(page.component);
  }

  checkAuth(){
    return Promise.resolve(this.settings.getAll()
      .then(settings => {
        return settings["auth"] == "true" && settings["rememberme"] == "true";
      }));
  }

  pushSetup(){
    return this.push.hasPermission()
    .then((res: any) => {

      //We have permission to send push notifications
      if (res.isEnabled) {
        const options: PushOptions = {
          android: {
              senderID: '74408042527',
              sound: 'true'
          },
          ios: {
              alert: 'true',
              badge: true,
              sound: 'true'
          },
          windows: {}
        };

        const pushObject: PushObject = this.push.init(options);

        pushObject.on('notification').subscribe((notification: any) => {

            this.checkAuth().then((res)=>{
              if (!res) {
                this.rootPage = LoginPage;
              }
              else
              {
                //прочтено
                if (notification.additionalData.msgHistId != null)
                  {
                    this.api.post("messages/setread", {HIST_ID: notification.additionalData.msgHistId})
                    .subscribe(()=>{
                      if (notification.additionalData.foreground) {
                        this.presentAlert(notification);
                      } else { 
                        this.goToMessages(notification);
                      }
                    });
                  }
              }
            });

          }
        );

        pushObject.on('registration').subscribe((registration: any) => {

          this.settings.updateSettingsData({key:"registration_id", value: registration.registrationId})
          .then(()=>{
            this.registrationId = registration.registrationId;

            console.log("set registration_id to db " + registration.registrationId);

            this.settings.getAll()
            .then(settings => {
    
              let us = this.user;
              us.registration({
                MOL_ID: settings["mol_id"],
                REGISTRATION_ID: registration.registrationId,
                MOBILE_PLATFORM: (this.platform.is('android') ? 1 : 2)
              }).subscribe(()=>{

                console.log("registration_id updated in app.component.ts");

              },(err)=>{
                this.hideLoader();
              });
            });
            
          });
        });

        pushObject.on('error').subscribe(error => {
          alert('Ошибка Push plugin ' + error)
        });

      } 
      /* else {
        alert('Вы не можете получать Push уведомления!');
      } */
    });
  }

  goToMessages(notification){
    this.nav.setRoot(MessagesPage);
    this.nav.push(MessagePage, { 
    item: {
      histId: notification.additionalData.msgHistId,
      msgId: notification.additionalData.msgId,
      title: notification.additionalData.msgTitle, 
      body: notification.additionalData.msgBody, 
      d_ADD: notification.additionalData.msgDAdd
    } 
  });
  }

  logout(){
      this.showLoader();
      this.settings.updateSettingsData({key:"auth", value:"false"});
      this.settings.getValue("registration_id")
        .then((res) => {
            this.api.post("mols/unregistration", {REGISTRATION_ID : res})
              .subscribe(()=>{
                this.hideLoader();
                //this.nav.setRoot(LoginPage);
                window.location.reload();
              }, (err) => {
                alert(err.message);
                this.hideLoader();
              });
      })
      .catch((err)=>{
        alert(err.message);
        this.hideLoader()
      });
  }

  presentAlert(notification) {
    let alert = this.alertCtrl.create({
      title: notification.title,
      subTitle: notification.message,
      buttons: [
      {
        text: 'OK',
        role: 'cancel',
        handler: () => {
          this.badgeProvider.update();
        }
      },
      {
        text: 'Подробнее',
        handler: () => {
          this.goToMessages(notification);
        }
      }
    ],
    cssClass: 'alertCustomCss'
    });
    alert.present();
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
