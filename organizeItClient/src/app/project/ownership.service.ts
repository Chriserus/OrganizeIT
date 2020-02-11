import {Injectable} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {AlertController} from "@ionic/angular";
import {AuthService} from "../authentication/auth.service";
import {NotificationService} from "../notifications/notification.service";
import {User} from "../interfaces/user.model";
import {Project} from "../interfaces/project.model";
import {Messages} from "../shared/Messages";
import {ProjectService} from "./project.service";

@Injectable({
  providedIn: 'root'
})
export class OwnershipService {
  readonly PROJECTS_URL = '/api/projects';
  readonly OWNERSHIP_URL = '/ownerships';

  constructor(private http: HttpClient, private alertController: AlertController, private authService: AuthService,
              private notificationService: NotificationService, private projectService: ProjectService) {
  }

  grantOwnershipToUser(project: Project, owner: User) {
    console.log("Granting owner: " + owner.email + " to project: " + project.title);
    this.addOwnershipToUser(owner, project).subscribe(
        response => {
          console.log(response);
          this.notificationService.sendNotification(owner, Messages.ownershipGrantedNotificationTitle,
              "You have been granted ownership rights to project: " + project.title).subscribe(
              (response: any) => {
                console.log(response);
                this.projectService.updateProjects();
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
