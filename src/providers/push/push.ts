import { Injectable } from '@angular/core';
import { Push, PushObject, PushOptions } from '@ionic-native/push';
import { App, Platform, AlertController, MenuController, Events } from 'ionic-angular';
import { MessagesPage } from '../../pages/messages/messages';
import { MessagePage } from '../../pages/message/message';
import { LoginPage } from '../../pages/login/login';

import { ApiProvider } from '../api/api';
import { DbProvider } from '../db/db';
import { UserProvider } from '../user/user';
import { MessagesProvider } from '../messages/messages';
import { ToastProvider } from '../toast/toast';
import { AlertProvider } from '../alert/alert';

@Injectable()
export class PushProvider {

  constructor(
    public appCtrl: App,
    public platform: Platform, 
    public push: Push,
    public events: Events,

    public alertCtrl: AlertController,
    public api: ApiProvider,
    public db: DbProvider, 
    public user: UserProvider,
    public messagesProvider: MessagesProvider,
    public toastProvider: ToastProvider,
    public alertProvider: AlertProvider,
    public menuCtrl: MenuController ) {

  }
  
  setup(molId)  {
    //console.log("push setup");
    
    return this.push.hasPermission()
    .then((res: any) => {

      //console.log("push has permission");

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
          //console.log("push notification");

           //проверка
           this.user.checkToken().then(() => {
            //если токен валидный пускаем в любом случае
            //прочтено
            if (notification.additionalData.msgHistId != null)
              {
                this.messagesProvider.setRead({HIST_ID: notification.additionalData.msgHistId})
                .then(()=>{
                  if (notification.additionalData.foreground) {
                    this.showAlert(notification);
                  } else { 
                    this.goToMessages(notification);
                  }
                }).catch((err)=>{
                  if (err.message) {
                    this.toastProvider.show(err.message);
                  }
                  this.setRootPage(LoginPage);
                });
              }
            }).catch((err)=>{
              if (err.message) {
                this.toastProvider.show(err.message);
              }
              this.setRootPage(LoginPage);
            });
          }
        );

        pushObject.on('registration').subscribe((registration: any) => {

          /* console.log("===============push registration===============");
          console.log("mol_id =" +  molId);
          console.log("registration = " + registration.registrationId);
 */
          let t1 = this.db.setValue('registrationId', registration.registrationId);
      
          let t2 = this.user.registration({
            MOL_ID: molId,
            REGISTRATION_ID: registration.registrationId,
            MOBILE_PLATFORM: (this.platform.is('android') ? 1 : 2)
          })

          return Promise.all([t1, t2])
          .then(()=> {
           /*  console.log("==================Красим в зеленый================="); */
            //зеленый индикатор push
            this.events.publish('user:registrationId', true);
          });

        });

        pushObject.on('error').subscribe(error => {
          this.events.publish('user:registrationId', false);
          //alert(Ошибка Push plugin ' + error!);
          //this.alertProvider.show('Ошибка Push plugin ' + error)
        });

      } 
      else {
        this.events.publish('user:registrationId', false);
        //console.log("push doesn't have permission");
        //alert('Вы не можете получать Push уведомления!');
      }
    });

  }

  setRootPage(page: any) {
    this.appCtrl.getRootNav().setRoot(page);
  }

  showAlert(notification) {
    let alert = this.alertCtrl.create({
      title: notification.title,
      subTitle: notification.message,
      buttons: [
      {
        text: 'OK',
        role: 'cancel',
        handler: () => {
          this.messagesProvider.getUnreadCount(true);
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
   
  goToMessages(notification){
    this.appCtrl.getRootNav().push(MessagesPage);
    this.appCtrl.getRootNav().push(MessagePage, { 
      item: {
        histId: notification.additionalData.msgHistId,
        msgId: notification.additionalData.msgId,
        title: notification.additionalData.msgTitle, 
        body: notification.additionalData.msgBody, 
        d_ADD: notification.additionalData.msgDAdd
      } 
    });
  }


       


}
