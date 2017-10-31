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
import { MomentModule } from 'angular2-moment';
import { MCispComponentModule } from '../component/mcisp.component.module'

import { MyApp } from './app.component';

import { LoginPage} from '../pages/login/login';
import { HomePage } from '../pages/home/home';
import { MessagesPage } from '../pages/messages/messages';
import { MessagePage } from '../pages/message/message';
import { PricePage } from '../pages/price/price';
import { PriceFilterPage } from '../pages/price-filter/price-filter';

import { ApiProvider } from '../providers/api/api';
import { DbProvider } from '../providers/db/db';
import { UserProvider } from '../providers/user/user';
import { BadgeProvider } from '../providers/badge/badge';
import { MessagesProvider } from '../providers/messages/messages';
import { PushProvider } from '../providers/push/push';
import { LoaderProvider } from '../providers/loader/loader';
import { AlertProvider } from '../providers/alert/alert';
import { ToastProvider } from '../providers/toast/toast';

//#region Price
import { PriceProvider } from '../providers/price/price';
import { BunkProvider } from '../providers/price/pickers/bunk/bunk';
import { BunkTovProvider } from '../providers/price/pickers/bunktov/bunktov';
//#endregion

/* import { MyAppProvider } from '../providers/my-app/my-app'; */

@NgModule({
  declarations: [
    MyApp,
    LoginPage,
    HomePage,
    MessagesPage,
    MessagePage,
    PricePage,
    PriceFilterPage
  ],
  imports: [
    BrowserModule,
    HttpModule,
    IonicModule.forRoot(MyApp),
    IonicStorageModule.forRoot(),
    MomentModule,
    MCispComponentModule
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    LoginPage,
    HomePage,
    MessagesPage,
    MessagePage,
    PricePage,
    PriceFilterPage
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
    PriceProvider,
    BunkProvider,
    BunkTovProvider,
    
/*     MyAppProvider */
  ]
})
export class AppModule {}
