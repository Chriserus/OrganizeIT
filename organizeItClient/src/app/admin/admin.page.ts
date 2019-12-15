import {Component, OnDestroy, OnInit} from '@angular/core';
import {Project} from "../interfaces/project.model";
import {Subject} from "rxjs";
import {ProjectService} from "../project/project.service";
import {takeUntil} from "rxjs/operators";
import {ProjectUser} from "../interfaces/project-user";
import {Messages} from "../shared/Messages";
import {User} from "../interfaces/user.model";
import {NotificationService} from "../notifications/notification.service";
import {AuthService} from "../authentication/auth.service";
import {AlertController} from "@ionic/angular";
import {MembershipService} from "../project/membership.service";

@Component({
  selector: 'app-admin',
  templateUrl: './admin.page.html',
  styleUrls: ['./admin.page.scss'],
})
// TODO: Add toast to inform, that approval was successful? Or that verification was successful? Project deleted?
export class AdminPage implements OnInit, OnDestroy {
  projects: Project[] = [];
  private unsubscribe: Subject<Project[]> = new Subject();

  constructor(private projectService: ProjectService, private notificationService: NotificationService,
              private authService: AuthService, private alertController: AlertController, private membershipService: MembershipService) {
  }

  ngOnInit() {
    this.getProjects();
  }

  isUserLoggedIn() {
    return JSON.parse(localStorage.getItem("loggedIn")) === true;
  }

  ngOnDestroy() {
    this.unsubscribe.next();
    this.unsubscribe.complete();
  }

  getProjects() {
    this.projects = [];
    this.projectService.getProjects().pipe(takeUntil(this.unsubscribe)).subscribe(projects => {
      console.log(projects);
      this.projects = projects;
    });
  }

  listMembers(project: Project) {
    return project.members.filter(member => member.approved).map(member => " " + member.user.firstName + " " + member.user.lastName);
  }

  listPotentialMembers(project: Project) {
    return project.members.filter(member => !member.approved);
  }

  projectHasRequests(project: Project) {
    return this.listPotentialMembers(project).length
  }

  isProjectOwner(project: Project) {
    return localStorage.getItem("loggedInUserEmail") === project.owner.email;
  }

  acceptUserToProject(project: Project, potentialMember: ProjectUser) {
    console.log("Accepting member: " + potentialMember.user.email + " to project: " + project.title);
    this.membershipService.approveMemberToProject(potentialMember.user, project).subscribe(
        response => {
          console.log(response);
          this.notificationService.sendNotification(potentialMember.user, Messages.enrollmentSuccessfulNotificationTitle,
              "Owner of project " + project.title + " has accepted your enrollment submission").subscribe(
              (response: any) => {
                console.log(response);
                this.getProjects();
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
    this.membershipService.deleteMemberFromProject(potentialMember.user, project).subscribe(
        response => {
          console.log(response);
          this.notificationService.sendNotification(potentialMember.user, "Enrollment submission rejected",
              "Owner of project " + project.title + " has rejected your enrollment submission").subscribe(
              (response: any) => {
                console.log(response);
                this.getProjects();
              },
              (error: any) => {
                console.log(error);
              });
        },
        error => {
          console.log(error);
        });
  }

  updateUser(form) {
    console.log(form.value);
    if (form.value.firstName === undefined || form.value.lastName === undefined) {
      return;
    }
    this.authService.getCurrentUser().subscribe((user: User) => {
      this.authService.updateInfo(form.value, user).subscribe(
          response => {
            console.log(response);
            location.reload();
          },
          error => {
            console.log(error);
          });
    });

  }

  async presentDeleteProjectAlert(project: Project) {
    const alert = await this.alertController.create({
      header: 'Deleting project!',
      message: 'You are deleting project: <p><strong>' + project.title + '</strong></p>',
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          handler: () => {
            console.log('Canceled');
          }
        }, {
          text: 'DELETE',
          cssClass: 'danger',
          handler: () => {
            this.projectService.deleteProject(project).subscribe(
                response => {
                  console.log(response);
                  this.sendNotificationToProjectMembersAboutProjectDeletion(project);
                  this.getProjects();
                },
                error => {
                  console.log(error);
                });
          }
        }]
    });
    await alert.present();
    let result = await alert.onDidDismiss();
    console.log(result);
  }

  async presentVerifyProjectAlert(project: Project) {
    const alert = await this.alertController.create({
      header: 'Verifying project!',
      message: 'You are verifying project: <p><strong>' + project.title + '</strong></p>',
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          handler: () => {
            console.log('Canceled');
          }
        }, {
          text: 'VERIFY',
          handler: () => {
            this.projectService.verifyProject(project).subscribe(
                response => {
                  console.log(response);
                  this.sendNotificationToProjectMembersAboutProjectVerification(project);
                  this.getProjects();
                },
                error => {
                  console.log(error);
                });
          }
        }]
    });
    await alert.present();
    let result = await alert.onDidDismiss();
    console.log(result);
  }

  private sendNotificationToProjectMembersAboutProjectVerification(project: Project) {
    project.members.filter(member => member.approved).map(member => member.user).forEach(user => {
      this.notificationService.sendNotification(user, Messages.projectVerifiedNotificationTitle,
          "Project: " + project.title + " has been verified").subscribe(
          (response: any) => {
            console.log(response);
          },
          (error: any) => {
            console.log(error);
          });
    });
  }

  private sendNotificationToProjectMembersAboutProjectDeletion(project: Project) {
    project.members.filter(member => member.approved).map(member => member.user).forEach(user => {
      this.notificationService.sendNotification(user, Messages.projectDeletedNotificationTitle,
          "Project: " + project.title + " has been deleted").subscribe(
          (response: any) => {
            console.log(response);
          },
          (error: any) => {
            console.log(error);
          });
    });
  }
}
