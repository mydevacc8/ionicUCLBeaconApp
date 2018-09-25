import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule } from '@angular/core';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';
import { SplashScreen } from '@ionic-native/splash-screen';
import { StatusBar } from '@ionic-native/status-bar';

import { MyApp } from './app.component';
import { EventListPage } from '../pages/event-list/event-list';
import { HomePage } from '../pages/home/home';
import { MapTabsPage } from '../pages/map-tabs/map-tabs';
import { DatabseProvider } from '../providers/databse/databse';

import { IonicStorageModule } from '@ionic/storage'
import {HttpModule } from '@angular/http'

import { SQLitePorter } from '@ionic-native/sqlite-porter'
import { SQLite } from '@ionic-native/sqlite'
import { IBeacon } from '@ionic-native/ibeacon';
@NgModule({
  declarations: [
    MyApp,
    HomePage,
    MapTabsPage,
    EventListPage
  ],
  imports: [
    BrowserModule,
    HttpModule,
    IonicStorageModule.forRoot(),
    IonicModule.forRoot(MyApp)
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    HomePage,
    MapTabsPage,
    EventListPage
  ],
  providers: [
    StatusBar,
    SplashScreen,
    {provide: ErrorHandler, useClass: IonicErrorHandler},
    DatabseProvider,
    SQLitePorter,
    SQLite,
    IBeacon
  ]
})
export class AppModule {}
