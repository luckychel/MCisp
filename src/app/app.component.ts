import { Component, ViewChild } from '@angular/core';
import { Nav, Platform, AlertController, LoadingController} from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { Push, PushObject, PushOptions } from '@ionic-native/push';
import { HeaderColor } from '@ionic-native/header-color';
import { Badge } from '@ionic-native/badge';

import { LoginPage} from '../pages/login/login';
import { HomePage } from '../pages/home/home';
import { MessagesPage } from '../pages/messages/messages';
import { MessagePage } from '../pages/message/message';

import { Api } from '../providers/api';
import { Settings } from '../providers/settings';


//declare var cordova: any;

@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  @ViewChild(Nav) nav: Nav;

  rootPage: any = null;
  loader: any;
  pages: Array<{title: string, component: any}>;

  constructor(public platform: Platform, 
    public statusBar: StatusBar, 
    public splashScreen: SplashScreen, 
    public headerColor: HeaderColor, 
    public settings:Settings, 
    public push: Push, 
    public alertCtrl: AlertController,
    public loadingCtrl: LoadingController, 
    public badge: Badge,
    public api: Api) 
    
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

      //this.badge.clear();

      this.settings.openDatabase()
        .then(() => {
          this.splashScreen.hide();
        })
        .then(() => {
           this.pushSetup();
        })
        .then(()=>{
           return this.checkAuth().then((res)=>{
            if (!res) {
              this.rootPage = LoginPage;
            }
            else
            {
              this.rootPage = HomePage;
            }
          });
        });
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
    this.push.hasPermission()
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
            
            if (notification.additionalData.foreground) {
              this.presentAlert(notification);
            } else { 
                this.nav.setRoot(MessagesPage);
                this.nav.push(MessagePage, { 
                item: {
                  id: notification.additionalData.id,
                  title: notification.additionalData.title, 
                  body: notification.additionalData.body, 
                  d_ADD: notification.additionalData.d_add
                } 
              });
            }
          }
        );

        pushObject.on('registration').subscribe((registration: any) => {
          this.settings.updateSettingsData({key:"registration_id", value:registration.registrationId});
          console.log(registration.registrationId);
        });

        pushObject.on('error').subscribe(error => {
          console.log('Error with Push plugin ' + error)
        });

      } 
      else {
        console.log('We do not have permission to send push notifications');
      }

    });
  }

  logout(){
      this.settings.updateSettingsData({key:"auth", value:"false"});
      this.settings.getValue("registration_id")
        .then((res) => {
            this.api.post("mols/unregistration", {REGISTRATION_ID : res})
              .subscribe(()=>{
                this.nav.setRoot(LoginPage);
              });
      });
  }

  presentAlert(msg) {
    let alert = this.alertCtrl.create({
      title: msg.title,
      subTitle: msg.message,
      buttons: [
      {
        text: 'OK',
        role: 'cancel',
        handler: () => {
          console.log('Cancel clicked');
        }
      },
      {
        text: 'Подробнее',
        handler: () => {
          console.log('Подробнее clicked');
        }
      }
    ]
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
