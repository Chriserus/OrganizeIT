import {Injectable} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {AlertController, Events} from "@ionic/angular";
import {AuthService} from "../authentication/auth.service";
import {NotificationService} from "../notifications/notification.service";
import {User} from "../interfaces/user.model";
import {Project} from "../interfaces/project.model";
import {Messages} from "../shared/Messages";

@Injectable({
  providedIn: 'root'
})
export class OwnershipService {
  readonly PROJECTS_URL = '/api/projects';
  readonly OWNERSHIP_URL = '/ownerships';

  constructor(private http: HttpClient, private alertController: AlertController, private authService: AuthService,
              private events: Events, private notificationService: NotificationService) {
  }

  grantOwnershipToUser(project: Project, owner: User, eventName: string) {
    console.log("Granting owner: " + owner.email + " to project: " + project.title);
    this.addOwnershipToUser(owner, project).subscribe(
        response => {
          console.log(response);
          this.notificationService.sendNotification(owner, Messages.ownershipGrantedNotificationTitle,
              "You have been granted ownership rights to project: " + project.title).subscribe(
              (response: any) => {
                console.log(response);
                this.events.publish(eventName);
              },
              (error: any) => {
                console.log(error);
              });
        },
        error => {
          console.log(error);
        });
  }

  addOwnershipToUser(owner: User, project: Project) {
    return this.http.post<Project>(this.PROJECTS_URL + "/" + project.id + this.OWNERSHIP_URL + "/" + owner.id, {}, {responseType: 'json'});
  }
}
