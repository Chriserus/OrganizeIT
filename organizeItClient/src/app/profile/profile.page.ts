import {Component, OnDestroy, OnInit} from '@angular/core';
import {takeUntil} from "rxjs/operators";
import {ProjectService} from "../project/project.service";
import {Project} from "../interfaces/project.model";
import {Subject} from "rxjs";
import {ProjectUser} from "../interfaces/project-user";
import {NotificationService} from "../notifications/notification.service";
import {AuthService} from "../authentication/auth.service";
import {User} from "../interfaces/user.model";

@Component({
  selector: 'app-profile',
  templateUrl: './profile.page.html',
  styleUrls: ['./profile.page.scss'],
})
export class ProfilePage implements OnInit, OnDestroy {
  projects: Project[] = [];
  private unsubscribe: Subject<Project[]> = new Subject();
  firstName: string;
  lastName: string;


  constructor(private projectService: ProjectService, private notificationService: NotificationService, private authService: AuthService) {
  }

  ngOnInit() {
    this.getProjects();
    this.authService.getCurrentUser().subscribe((response: User) => {
      this.firstName = response.firstName;
      this.lastName = response.lastName;
    });
  }

  ngOnDestroy() {
    this.unsubscribe.next();
    this.unsubscribe.complete();
  }

  getProjects() {
    this.projects = [];
    this.projectService.getProjectsByOwnerOrMemberEmail(localStorage.getItem("loggedInUserEmail")).pipe(takeUntil(this.unsubscribe)).subscribe(projects => {
      console.log(projects);
      this.projects = projects;
    });
  }

  listMembers(project: Project) {
    return project.members.filter(member => member.approved).map(member => member.user.firstName + " " + member.user.lastName);
  }

  listPotentialMembers(project: Project) {
    return project.members.filter(member => !member.approved);
  }

  acceptUserToProject(project: Project, potentialMember: ProjectUser) {
    console.log("Accepting member: " + potentialMember.user.email + " to project: " + project.title);
    this.projectService.approveMemberToProject(potentialMember.user.email, project).subscribe(
        response => {
          console.log(response);
          this.notificationService.sendNotification(potentialMember.user.email, "Enrollment successful",
              "Owner of project " + project.title + " has accepted your enrollment submission").subscribe(
              (response: any) => {
                console.log(response);
                location.reload();
              },
              (error: any) => {
                console.log(error);
              });
        },
        error => {
          console.log(error);
        });
  }

  rejectUser(project: Project, potentialMember: ProjectUser) {
    console.log("Rejecting user: " + potentialMember.user.email + ", project: " + project.title);
    this.projectService.deleteMemberFromProject(potentialMember.user.email, project).subscribe(
        response => {
          console.log(response);
          this.notificationService.sendNotification(potentialMember.user.email, "Enrollment submission rejected",
              "Owner of project " + project.title + " has rejected your enrollment submission").subscribe(
              (response: any) => {
                console.log(response);
                location.reload();
              },
              (error: any) => {
                console.log(error);
              });
        },
        error => {
          console.log(error);
        });
  }

  // TODO: When unchanged -> field is empty? Check it
  updateUser(form) {
    console.log(form.value);
    if (form.value.firstName === undefined || form.value.lastName === undefined) {
      return;
    }
    this.authService.updateInfo(form.value, localStorage.getItem("loggedInUserEmail")).subscribe(
        response => {
          console.log(response);
        },
        error => {
          console.log(error);
        });
  }
}
