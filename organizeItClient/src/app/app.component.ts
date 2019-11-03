import {Component, OnDestroy, OnInit} from '@angular/core';

import {Platform} from '@ionic/angular';
import {SplashScreen} from '@ionic-native/splash-screen/ngx';
import {StatusBar} from '@ionic-native/status-bar/ngx';
import {AuthService} from "./authentication/auth.service";
import {User} from "./interfaces/user.model";
import {Subject} from "rxjs";
import {takeUntil} from "rxjs/operators";
import {ToastService} from "./shared/toast.service";
import {Router} from "@angular/router";
import {Messages} from "./shared/Messages";
import {NotificationService} from "./notifications/notification.service";
import firebase from '@firebase/app';
import {Network} from "@ngx-pwa/offline";

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html'
})
export class AppComponent implements OnInit, OnDestroy {
  public publicAppPages = [
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
      title: 'Agenda',
      url: '/agenda',
      icon: 'calendar'
    },
    {
      title: 'Archive',
      url: '/archive',
      icon: 'filing'
    }
  ];

  public userAppPages = [
    {
      title: 'Add project',
      url: '/submission',
      icon: 'add'
    },
    {
      title: 'Board',
      url: '/board',
      icon: 'contacts'
    }
  ];

  public adminPanel = {
    title: 'Admin panel',
    url: '/admin',
    icon: 'finger-print'
  };

  public loggedInUser: User;
  private displayName: string;
  private unsubscribe: Subject<User> = new Subject();
  public loggedIn: boolean;
  public online$ = this.network.onlineChanges;

  constructor(
      private platform: Platform,
      private splashScreen: SplashScreen,
      private statusBar: StatusBar,
      public authService: AuthService,
      private toastService: ToastService,
      private router: Router,
      private notificationService: NotificationService,
      private network: Network
  ) {
    this.initializeApp();
  }

  initializeApp() {
    this.platform.ready().then(() => {
      this.statusBar.styleDefault();
      this.splashScreen.hide();
      const messaging = firebase.messaging();
      messaging.onMessage(payload => {
        console.log("Message received. ", payload);
        const {title, ...options} = payload.notification;
        navigator.serviceWorker.ready.then(registration => {
          registration.showNotification(title, options);
        });
      });
    });
  }

  logout() {
    this.authService.logout().subscribe(response => {
      console.log(response);
      this.toastService.showTemporarySuccessMessage(Messages.loggedOutSuccessMessage).then(() => {
        localStorage.setItem("loggedIn", 'false');
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

  async ngOnInit() {
    this.determineUserLoggedIn();
    // this.notificationService.askForPermissions();
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
            // TODO: Correct place to ask for permissions \/
            this.notificationService.askForPermissions(this.loggedInUser);
          },
          (error: any) => {
            console.log(error);
            this.loggedIn = false;
            localStorage.setItem("loggedIn", 'false');
          });
    }
  }

  sendTestNotification() {
    this.notificationService.sendNotification(this.loggedInUser,
        "Test notification", "Test notification body").subscribe(
        (response: any) => {
          console.log(response);
        },
        (error: any) => {
          console.log(error);
        });
  }

  ngOnDestroy() {
    this.unsubscribe.next();
    this.unsubscribe.complete();
  }
}
