import {Injectable} from '@angular/core';
import {Firebase} from "@ionic-native/firebase/ngx";
import {Platform} from "@ionic/angular";
import {AngularFirestore} from "@angular/fire/firestore";

@Injectable({
  providedIn: 'root'
})
export class NotificationService {

  constructor(private firebase: Firebase,
              private afs: AngularFirestore,
              private platform: Platform) {
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
