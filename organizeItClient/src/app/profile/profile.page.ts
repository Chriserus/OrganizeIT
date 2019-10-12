import {Component, OnDestroy, OnInit} from '@angular/core';
import {takeUntil} from "rxjs/operators";
import {ProjectService} from "../project/project.service";
import {Project} from "../interfaces/project.model";
import {Subject} from "rxjs";
import {ProjectUser} from "../interfaces/project-user";
import {NotificationService} from "../notifications/notification.service";
import {AuthService} from "../authentication/auth.service";
import {AlertController} from "@ionic/angular";
import {Messages} from "../shared/Messages";

@Component({
  selector: 'app-profile',
  templateUrl: './profile.page.html',
  styleUrls: ['./profile.page.scss'],
})
export class ProfilePage implements OnInit, OnDestroy {
  projects: Project[] = [];
  private unsubscribe: Subject<Project[]> = new Subject();


  constructor(private projectService: ProjectService, private notificationService: NotificationService,
              private authService: AuthService, private alertController: AlertController) {
  }

  ngOnInit() {
    this.getProjects();
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
          this.notificationService.sendNotification(potentialMember.user.email, Messages.enrollmentSuccessfulTitle,
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
          location.reload();
        },
        error => {
          console.log(error);
        });
  }

  isProjectOwner(project: Project) {
    return localStorage.getItem("loggedInUserEmail") === project.owner.email;
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
          // TODO: Send notifications to all members
          handler: () => {
            this.projectService.deleteProject(project).subscribe(
                response => {
                  console.log(response);
                  project.members.map(member => member.user.email).forEach(userEmail => {
                    this.notificationService.sendNotification(userEmail, "Project deleted", "Project: " + project.title + " has been deleted").subscribe(
                        (response: any) => {
                          console.log(response);
                        },
                        (error: any) => {
                          console.log(error);
                        });
                  });
                  this.getProjects();
                },
                error => {
                  console.log(error);
                }
            );
          }
        }
      ]
    });

    await alert.present();
    let result = await alert.onDidDismiss();
    console.log(result);
  }
}
