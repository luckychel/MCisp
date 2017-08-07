import { Component, ViewChild } from '@angular/core';
import { Nav, Platform } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { Push, PushObject, PushOptions } from '@ionic-native/push';

import { Settings } from '../providers/settings';

import { HomePage } from '../pages/home/home';
import { ListPage } from '../pages/list/list';
import { LoginPage} from '../pages/login/login';

declare var cordova: any;

@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  @ViewChild(Nav) nav: Nav;

  rootPage: any = null;

  pages: Array<{title: string, component: any}>;

  constructor(public platform: Platform, public statusBar: StatusBar, public splashScreen: SplashScreen, public settings:Settings, public push: Push) {
       
    this.initializeApp();

  }

  initializeApp() {
    this.platform.ready().then(() => {
        // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.

      if (cordova.platformId == 'android') {
        this.statusBar.backgroundColorByHexString("#4d7198");
      } else {
          this.statusBar.backgroundColorByName("blue");
      }

      this.settings.openDatabase()
        .then(() => {
          this.splashScreen.hide();
        })
        .then(()=>{
          debugger
           return this.checkAuth().then((res)=>{
            
            if (res) {
              this.rootPage = LoginPage;
            }
            else
            {
              this.rootPage = HomePage;
      
              // used for an example of ngFor and navigation
              this.pages = [
                { title: 'Home', component: HomePage },
                { title: 'List', component: ListPage }
              ];
            }
          });
        }).then(()=>{
          debugger
           this.pushSetup();
        });
    });
  }

  openPage(page) {
    // Reset the content nav to have just this page
    // we wouldn't want the back button to show in this scenario
    this.nav.setRoot(page.component);
  }

  checkAuth(){
    return Promise.resolve(this.settings.getAll()
      .then(settings => {
        return settings["auth"] == "0" || settings["rememberme"] == "false";
      }));
  }
  
  pushSetup(){
    this.push.hasPermission()
    .then((res: any) => {

      // to initialize push notifications
      if (res.isEnabled) {
        const options: PushOptions = {
          android: {
              senderID: '74408042527'
          },
          ios: {
              alert: 'true',
              badge: true,
              sound: 'false'
          }
        };

        const pushObject: PushObject = this.push.init(options);

        pushObject.on('notification').subscribe((notification: any) => {
            debugger;
             if (notification.additionalData.foreground) {
                alert(notification.message);
              } else {

                //if user NOT using app and push notification comes
                //TODO: Your logic on click of push notification directly
                //this.nav.push(DetailsPage, { message: data.message });
                alert('Push notification clicked');
                this.nav.setRoot(HomePage);
              }
          }
        );

        pushObject.on('registration').subscribe((registration: any) => {
          console.log('Device registered = ' + registration.registrationId)
        });

        pushObject.on('error').subscribe(error => {
          console.log('Error with Push plugin ' + error)
        });

      } 
      else {
        alert('We do not have permission to send push notifications');
      }

    });
  }
}
