import {NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';
import {RouteReuseStrategy} from '@angular/router';

import {IonicModule, IonicRouteStrategy} from '@ionic/angular';
import {SplashScreen} from '@ionic-native/splash-screen/ngx';
import {StatusBar} from '@ionic-native/status-bar/ngx';

import {AppComponent} from './app.component';
import {AppRoutingModule} from './app-routing.module';
import {HttpClientModule} from '@angular/common/http';

import {Firebase} from '@ionic-native/firebase/ngx';
import {AngularFireModule} from "@angular/fire";
import {AngularFirestore, AngularFirestoreModule} from "@angular/fire/firestore";
import {environment} from "../environments/environment";
import {ServiceWorkerModule} from '@angular/service-worker';
import {AngularFireMessaging} from "@angular/fire/messaging";
import {Geolocation} from '@ionic-native/geolocation/ngx';
import {IonicStorageModule} from "@ionic/storage";
import {FormsModule} from "@angular/forms";

@NgModule({
  declarations: [AppComponent],
  entryComponents: [],
  imports: [
    BrowserModule,
    IonicModule.forRoot(),
    IonicStorageModule.forRoot(),
    AppRoutingModule,
    HttpClientModule,
    AngularFireModule.initializeApp(environment.firebase),
    AngularFirestoreModule,
    ServiceWorkerModule.register('combined-sw.js', {
      enabled: environment.production
    }),
    FormsModule
  ],
  providers: [
    StatusBar,
    SplashScreen,
    Firebase,
    AngularFirestore,
    Geolocation,
    AngularFireMessaging,
    {provide: RouteReuseStrategy, useClass: IonicRouteStrategy}
  ],
  bootstrap: [AppComponent]
})
export class AppModule {
}
