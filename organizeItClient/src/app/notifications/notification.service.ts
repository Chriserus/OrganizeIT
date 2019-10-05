import {Injectable} from '@angular/core';
import '@firebase/messaging';
import {AngularFireMessaging} from "@angular/fire/messaging";
import {HttpClient, HttpHeaders} from "@angular/common/http";

@Injectable({
  providedIn: 'root'
})
export class NotificationService {

  readonly NOTIFICATION_URL = "/api/notification/";
  readonly NOTIFICATION_PERMISSION_URL = "/api/notification/permission/";

  constructor(private angularFireMessaging: AngularFireMessaging, private http: HttpClient) {
  }

  addPermission(token: string) {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        responseType: 'application/json'
      })
    };
    let jsonData = {
      'token': token
    };
    this.http.post(this.NOTIFICATION_PERMISSION_URL + localStorage.getItem("loggedInUserEmail") + "/", jsonData, httpOptions).subscribe(
        (response: any) => {
          console.log(response);
        },
        (error: any) => {
          console.log(error);
        });
  }

  askForPermissions() {
    this.angularFireMessaging.getToken.subscribe(
        oldToken => {
          if (oldToken === null) {
            this.angularFireMessaging.requestToken
                .subscribe(
                    newToken => {
                      console.log('Permission granted! Save to the server!', newToken);
                      this.addPermission(newToken);
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

  sendNotification(userEmail: string, title: string, body: string) {
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
    return this.http.post(this.NOTIFICATION_URL + userEmail + "/", jsonData, httpOptions);
  }
}
