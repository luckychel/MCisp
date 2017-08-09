import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule } from '@angular/core';
import { HttpModule/* , Http */ } from '@angular/http';
import { IonicApp, IonicErrorHandler, IonicModule} from 'ionic-angular';

import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { Push } from '@ionic-native/push';
import { HeaderColor } from '@ionic-native/header-color';
import { Badge } from '@ionic-native/badge';

import { MyApp } from './app.component';

import { LoginPage} from '../pages/login/login';
import { HomePage } from '../pages/home/home';
import { MessagesPage } from '../pages/messages/messages';
import { MessagePage } from '../pages/message/message';

import { Settings } from '../providers/settings';
import { Api } from '../providers/api';
import { User } from '../providers/user';


@NgModule({
  declarations: [
    MyApp,
    LoginPage,
    HomePage,
    MessagesPage,
    MessagePage
  ],
  imports: [
    BrowserModule,
    HttpModule,
    IonicModule.forRoot(MyApp),
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    LoginPage,
    HomePage,
    MessagesPage,
    MessagePage
  ],
  providers: [
    StatusBar,
    SplashScreen,
    Push,
    HeaderColor,
    Badge,
    {provide: ErrorHandler, useClass: IonicErrorHandler},
    Settings,
    Api,
    User
  ]
})
export class AppModule {}
