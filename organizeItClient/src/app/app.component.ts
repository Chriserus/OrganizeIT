import {Component, OnDestroy, OnInit} from '@angular/core';

import {Platform} from '@ionic/angular';
import {SplashScreen} from '@ionic-native/splash-screen/ngx';
import {StatusBar} from '@ionic-native/status-bar/ngx';
import {AuthService} from "./authentication/auth.service";
import {User} from "./interfaces/user.model";
import {Subject} from "rxjs";
import {takeUntil} from "rxjs/operators";

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html'
})
export class AppComponent implements OnInit, OnDestroy {
  public appPages = [
    {
      title: 'Home',
      url: '/home',
      icon: 'home'
    },
    {
      title: 'List',
      url: '/list',
      icon: 'list'
    },
    {
      title: 'Add project',
      url: '/submission',
      icon: 'add'
    },
    {
      title: 'Agenda',
      url: '/agenda',
      icon: 'calendar'
    },
    {
      title: 'Board',
      url: '/board',
      icon: 'contacts'
    },
    {
      title: 'Archive',
      url: '/archive',
      icon: 'filing'
    }
  ];

  private loggedInUser: User;
  private displayName: string;
  private unsubscribe: Subject<User> = new Subject();
  private loggedIn: boolean;

  constructor(
      private platform: Platform,
      private splashScreen: SplashScreen,
      private statusBar: StatusBar,
      private authService: AuthService
  ) {
    this.initializeApp();
  }

  initializeApp() {
    this.platform.ready().then(() => {
      this.statusBar.styleDefault();
      this.splashScreen.hide();
    });
  }

  logout() {
    this.authService.logout();
    location.reload()
  }

  ngOnInit() {
    if (JSON.parse(localStorage.getItem("loggedIn")) === true) {
      this.authService.getCurrentUser().pipe(takeUntil(this.unsubscribe)).subscribe(
          (response: any) => {
            this.loggedInUser = response;
            console.log(this.loggedInUser);
            this.displayName = this.loggedInUser.firstName + " " + this.loggedInUser.lastName;
            this.loggedIn = true;
            localStorage.setItem("loggedIn", 'true');
          },
          (error: any) => {
            console.log(error)
            this.loggedIn = false;
            localStorage.setItem("loggedIn", 'false');
          });
    }
  }

  ngOnDestroy() {
    this.unsubscribe.next();
    this.unsubscribe.complete();
  }
}
