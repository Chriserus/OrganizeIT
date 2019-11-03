import {Injectable} from '@angular/core';
import '@firebase/messaging';
import {AngularFireMessaging} from "@angular/fire/messaging";
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {User} from "../interfaces/user.model";

@Injectable({
  providedIn: 'root'
})
export class NotificationService {

  readonly NOTIFICATION_URL = "/api/notifications";
  readonly NOTIFICATION_PERMISSION_URL = "/api/notifications/permissions";

  constructor(private angularFireMessaging: AngularFireMessaging, private http: HttpClient) {
  }

  addPermission(token: string, user: User) {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        responseType: 'application/json'
      })
    };
    let jsonData = {
      'token': token
    };
    this.http.post(this.NOTIFICATION_PERMISSION_URL + "/" + user.id, jsonData, httpOptions).subscribe(
        (response: any) => {
          console.log(response);
        },
        (error: any) => {
          console.log(error);
        });
  }

  askForPermissions(user: User) {
    this.angularFireMessaging.getToken.subscribe(
        oldToken => {
          if (oldToken === null) {
            this.angularFireMessaging.requestToken
                .subscribe(
                    newToken => {
                      console.log('Permission granted! Save to the server!', newToken);
                      this.addPermission(newToken, user);
                    },
                    error => {
                      console.error(error);
                    }
                );
          }
        },
        error => {
          console.error(error);
        });
  }

  sendNotification(user: User, title: string, body: string) {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        responseType: 'application/json'
      })
    };
    let jsonData = {
      "title": title,
      "body": body,
      "click_action": "/profile"
    };
    return this.http.post(this.NOTIFICATION_URL + "/" + user.id, jsonData, httpOptions);
  }
}
