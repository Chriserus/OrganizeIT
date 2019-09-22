import {Component, OnDestroy, OnInit} from '@angular/core';

import {Platform} from '@ionic/angular';
import {SplashScreen} from '@ionic-native/splash-screen/ngx';
import {StatusBar} from '@ionic-native/status-bar/ngx';
import {AuthService} from "./authentication/auth.service";
import {User} from "./interfaces/user.model";
import {Subject} from "rxjs";
import {takeUntil, tap} from "rxjs/operators";
import {ToastService} from "./shared/toast.service";
import {Router} from "@angular/router";
import {Messages} from "./shared/Messages";
import {NotificationService} from "./notifications/notification.service";

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
  public loggedIn: boolean;

  constructor(
      private platform: Platform,
      private splashScreen: SplashScreen,
      private statusBar: StatusBar,
      private authService: AuthService,
      private toastService: ToastService,
      private router: Router,
      private notificationService: NotificationService
  ) {
    this.initializeApp();
  }

  initializeApp() {
    this.platform.ready().then(() => {
      this.statusBar.styleDefault();
      this.splashScreen.hide();
      this.notificationSetup();
    });
  }

  logout() {
    this.authService.logout().subscribe(response => {
      console.log(response);
      this.toastService.showTemporarySuccessMessage(Messages.loggedOutSuccessMessage).then(() => {
        this.determineUserLoggedIn();
        this.router.navigateByUrl("login").then(() => {
          window.location.reload();
        });
      });
    }, error => {
      console.log(error);
      this.toastService.showTemporaryErrorMessage(Messages.loggedOutErrorMessage);
      this.determineUserLoggedIn();
    });
  }

  ngOnInit() {
    this.notificationService.init();
    this.determineUserLoggedIn();
    this.platform.ready().then(async () => {
      await this.notificationService.requestPermission();
    });
  }

  private determineUserLoggedIn() {
    console.log(localStorage.getItem("loggedIn"));
    if (JSON.parse(localStorage.getItem("loggedIn")) === true) {
      this.authService.getCurrentUser().pipe(takeUntil(this.unsubscribe)).subscribe(
          (response: any) => {
            this.loggedInUser = response;
            console.log(this.loggedInUser);
            this.displayName = this.loggedInUser.firstName + " " + this.loggedInUser.lastName;
            this.loggedIn = true;
            localStorage.setItem("loggedInUserEmail", this.loggedInUser.email);
          },
          (error: any) => {
            console.log(error);
            this.loggedIn = false;
            localStorage.setItem("loggedIn", 'false');
          });
    }
  }

  ngOnDestroy() {
    this.unsubscribe.next();
    this.unsubscribe.complete();
  }

  private notificationSetup() {
    this.notificationService.onNotifications().pipe(
        tap(msg => {
          this.toastService.showTemporarySuccessMessage(msg);
        })
    ).subscribe()
  }
}
