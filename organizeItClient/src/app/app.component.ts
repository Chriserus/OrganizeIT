import {Component, OnDestroy, OnInit} from '@angular/core';

import {Platform} from '@ionic/angular';
import {SplashScreen} from '@ionic-native/splash-screen/ngx';
import {StatusBar} from '@ionic-native/status-bar/ngx';
import {AuthService} from "./authentication/auth.service";
import {User} from "./interfaces/user.model";
import {Subject, timer} from "rxjs";
import {ToastService} from "./shared/toast.service";
import {Router} from "@angular/router";
import {Messages} from "./shared/Messages";
import {NotificationService} from "./notifications/notification.service";
import firebase from '@firebase/app';
import {Network} from "@ngx-pwa/offline";
import {ThemeService} from "./shared/theme.service";
import {DataService} from "./shared/data.service";
import {Notification} from "./interfaces/notification";

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
      title: 'Projects list',
      url: '/list',
      icon: 'list'
    },
    // {
    //   title: 'Agenda',
    //   url: '/agenda',
    //   icon: 'calendar'
    // },
    // {
    //   title: 'Archive',
    //   url: '/archive',
    //   icon: 'filing'
    // }
  ];

  public userAppPages = [
    {
      title: 'Add project',
      url: '/submission',
      icon: 'add'
    },
    {
      title: 'Discussion board',
      url: '/board',
      icon: 'people'
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

  constructor(private platform: Platform, private splashScreen: SplashScreen, private statusBar: StatusBar,
              public authService: AuthService, private toastService: ToastService, private router: Router,
              private notificationService: NotificationService, private network: Network,
              public themeService: ThemeService, private data: DataService) {
    this.authService.getCurrentUser().subscribe((user: User) => {
      this.data.changeCurrentUser(user);
    });
    this.data.currentUser.subscribe(user => {
      this.loggedInUser = user;
      sessionStorage.setItem("loggedIn", String(user != null));
      this.loggedIn = user != null;
      this.determineUserLoggedIn();
    });
    this.initializeApp();
  }

  async ngOnInit() {
    this.data.currentUser.subscribe(user => {
      this.loggedInUser = user;
      sessionStorage.setItem("loggedIn", String(user != null));
      this.loggedIn = user != null;
      this.determineUserLoggedIn();
    });
    // this.notificationService.askForPermissions();
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
        this.notificationService.getNotificationsByRecipient(this.loggedInUser).subscribe((notifications: Notification[]) => {
          this.data.changeUserNotifications(notifications);
        });
      });
    });
  }

  logout() {
    this.authService.logout().subscribe(response => {
      console.log(response);
      this.toastService.showTemporarySuccessMessage(Messages.loggedOutSuccessMessage).then(() => {
        this.router.navigateByUrl("home").then(() => {
          this.data.changeCurrentUser(null);
          console.log("User after logout:", this.loggedInUser);
        });
      });
    }, error => {
      console.log(error);
      this.toastService.showTemporaryErrorMessage(Messages.loggedOutErrorMessage);
      this.determineUserLoggedIn();
    });
  }

  determineUserLoggedIn() {
    if (JSON.parse(sessionStorage.getItem("loggedIn")) === true) {
      //TODO: Check correctness, for now after a timeout user is being logged out
      const source = timer(1801000); //1 800 000 ms = 30 min -> default spring security timeout
      const subscribe = source.subscribe(val => this.authService.getCurrentUser().subscribe((user: User) => {
        this.data.changeCurrentUser(user)
      }));
      console.log("Is user online?", this.loggedInUser);
      this.displayName = this.loggedInUser.firstName + " " + this.loggedInUser.lastName;
      this.loggedIn = true;
      sessionStorage.setItem("loggedInUserEmail", this.loggedInUser.email);
      // TODO: Correct place to ask for permissions \/
      this.notificationService.askForPermissions(this.loggedInUser);
    } else {
      this.clearUserData();
    }
  }

  private clearUserData() {
    this.displayName = undefined;
    this.loggedIn = false;
    sessionStorage.removeItem("loggedInUserEmail");
    sessionStorage.removeItem("loggedIn");
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
