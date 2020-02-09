import {Injectable} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Project} from "../interfaces/project.model";
import {AlertController} from "@ionic/angular";
import {User} from "../interfaces/user.model";
import {AuthService} from "../authentication/auth.service";
import {ProjectUser} from "../interfaces/project-user";
import {Messages} from "../shared/Messages";
import {NotificationService} from "../notifications/notification.service";
import {DataService} from "../shared/data.service";
import {ProjectService} from "./project.service";

@Injectable({
  providedIn: 'root'
})
export class MembershipService {
  readonly PROJECTS_URL = '/api/projects';
  readonly MEMBERSHIP_URL = '/memberships';
  private loggedInUser: User;

  constructor(private http: HttpClient, private alertController: AlertController, private authService: AuthService,
              private notificationService: NotificationService, private data: DataService, private projectService: ProjectService) {
    this.data.currentUser.subscribe(user => this.loggedInUser = user);
  }

  acceptMembershipRequest(project: Project, potentialMember: ProjectUser, eventName: string) {
    console.log("Accepting member: " + potentialMember.user.email + " to project: " + project.title);
    this.approveMemberToProject(potentialMember.user, project).subscribe(
        response => {
          console.log(response);
          this.notificationService.sendNotification(potentialMember.user, Messages.enrollmentSuccessfulNotificationTitle,
              "Owner of project " + project.title + " has accepted your enrollment submission").subscribe(
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

  rejectMembershipRequest(project: Project, potentialMember: ProjectUser, reason: string, eventName: string) {
    console.log("Rejecting user: " + potentialMember.user.email + ", project: " + project.title);
    this.deleteMemberFromProject(potentialMember.user, project).subscribe(
        response => {
          console.log(response);
          this.notificationService.sendNotification(potentialMember.user, "Enrollment submission rejected",
              "Owner of project " + project.title + " has rejected your enrollment submission. " + reason).subscribe(
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

  userEnrollmentPending(project: Project) {
    return project.members.filter(member => !member.approved).map(member => member.user.email).includes(sessionStorage.getItem("loggedInUserEmail"));
  }

  userAlreadyEnrolled(project: Project) {
    return project.members.filter(member => member.approved).map(member => member.user.email).includes(sessionStorage.getItem("loggedInUserEmail"));
  }

  addMemberToProject(member: User, project: Project) {
    return this.http.post<Project>(this.PROJECTS_URL + "/" + project.id + this.MEMBERSHIP_URL + "/" + member.id, {}, {responseType: 'json'});
  }

  approveMemberToProject(member: User, project: Project) {
    return this.http.put<Project>(this.PROJECTS_URL + "/" + project.id + this.MEMBERSHIP_URL + "/" + member.id, {}, {responseType: 'json'});
  }

  deleteMemberFromProject(member: User, project: Project) {
    return this.http.delete<Project>(this.PROJECTS_URL + "/" + project.id + this.MEMBERSHIP_URL + "/" + member.id, {responseType: 'json'});
  }
}
