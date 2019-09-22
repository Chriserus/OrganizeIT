import {Injectable} from '@angular/core';
import {Firebase} from "@ionic-native/firebase/ngx";
import {Platform} from "@ionic/angular";
import {AngularFirestore} from "@angular/fire/firestore";
import {environment} from "../../environments/environment";
import {firebase} from '@firebase/app';
import '@firebase/messaging';

@Injectable({
  providedIn: 'root'
})
export class NotificationService {

  constructor(private firebase: Firebase,
              private afs: AngularFirestore,
              private platform: Platform) {
  }

  init(): Promise<void> {
    return new Promise<void>((resolve, reject) => {
      navigator.serviceWorker.ready.then((registration) => {
        // Don't crash an error if messaging not supported
        if (!firebase.messaging.isSupported()) {
          resolve();
          return;
        }

        const messaging = firebase.messaging();

        // Register the Service Worker
        messaging.useServiceWorker(registration);

        // Initialize your VAPI key
        messaging.usePublicVapidKey(
            environment.firebase.vapidKey
        );

        // Optional and not covered in the article
        // Listen to messages when your app is in the foreground
        messaging.onMessage((payload) => {
          console.log(payload);
        });
        // Optional and not covered in the article
        // Handle token refresh
        messaging.onTokenRefresh(() => {
          messaging.getToken().then(
              (refreshedToken: string) => {
                console.log(refreshedToken);
              }).catch((err) => {
            console.error(err);
          });
        });

        resolve();
      }, (err) => {
        reject(err);
      });
    });
  }

  requestPermission(): Promise<void> {
    return new Promise<void>(async (resolve) => {
      if (!Notification) {
        resolve();
        return;
      }
      if (!firebase.messaging.isSupported()) {
        resolve();
        return;
      }
      try {
        const messaging = firebase.messaging();
        await Notification.requestPermission();

        const token: string = await messaging.getToken();

        console.log('User notifications token:', token);
      } catch (err) {
        // No notifications granted
      }

      resolve();
    });
  }


  async getToken(email: string) {
    let token;

    if (this.platform.is('android')) {
      token = await this.firebase.getToken();
    }

    if (this.platform.is('ios')) {
      token = await this.firebase.getToken();
      await this.firebase.grantPermission();
    }

    this.saveToken(token, email);
  }

  private saveToken(token, email) {
    if (!token) return;

    const devicesRef = this.afs.collection('devices');

    const data = {
      token,
      userId: email
    };

    return devicesRef.doc(token).set(data);
  }

  onNotifications() {
    return this.firebase.onNotificationOpen();
  }
}
