import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule } from '@angular/core';
import { HttpModule/* , Http */ } from '@angular/http';
import { IonicApp, IonicErrorHandler, IonicModule  } from 'ionic-angular';
import { IonicStorageModule } from '@ionic/storage';

import { AppVersion } from '@ionic-native/app-version';
import { Network } from '@ionic-native/network';
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

import { ApiProvider } from '../providers/api/api';
import { DbProvider } from '../providers/db/db';
import { UserProvider } from '../providers/user/user';
import { BadgeProvider } from '../providers/badge/badge';
import { MessagesProvider } from '../providers/messages/messages';
import { PushProvider } from '../providers/push/push';
import { LoaderProvider } from '../providers/loader/loader';
import { AlertProvider } from '../providers/alert/alert';
import { ToastProvider } from '../providers/toast/toast';
/* import { MyAppProvider } from '../providers/my-app/my-app'; */

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
    IonicStorageModule.forRoot()
    
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
    AppVersion,
    Network,
    Push,
    HeaderColor,
    Badge,
    {provide: ErrorHandler, useClass: IonicErrorHandler},
    ApiProvider,
    DbProvider,
    UserProvider,
    BadgeProvider,
    MessagesProvider,
    PushProvider,
    LoaderProvider,
    AlertProvider,
    ToastProvider,
/*     MyAppProvider */
  ]
})
export class AppModule {}
