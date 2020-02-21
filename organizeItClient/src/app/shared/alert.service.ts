import {Injectable} from '@angular/core';
import {Project} from "../interfaces/project.model";
import {AlertController} from "@ionic/angular";
import {ProjectService} from "../project/project.service";
import {NotificationService} from "../notifications/notification.service";
import {Comment} from "../interfaces/comment.model";
import {CommentService} from "../comment/comment.service";
import {User} from "../interfaces/user.model";
import {AuthService} from "../authentication/auth.service";
import {MembershipService} from "../project/membership.service";
import {ToastService} from "./toast.service";
import {ProjectUser} from "../interfaces/project-user";
import {OwnershipService} from "../project/ownership.service";
import {Messages} from "./Messages";
import {DataService} from "./data.service";

@Injectable({
  providedIn: 'root'
})
export class AlertService {
  loggedInUser: User;

  constructor(private alertController: AlertController, private projectService: ProjectService,
              private notificationService: NotificationService,
              private commentService: CommentService, private authService: AuthService,
              private membershipService: MembershipService, private toastService: ToastService,
              private ownershipService: OwnershipService, private data: DataService) {
    this.authService.getCurrentUser().subscribe((user: User) => {
      this.loggedInUser = user;
    });
  }

  async presentMemberOptionsAlert(project: Project, member: User) {
    const alert = await this.alertController.create({
      header: member.firstName + " " + member.lastName,
      message: member.email,
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
            this.membershipService.deleteMemberFromProject(member, project).subscribe(() => {
              this.notificationService.sendNotification(member, Messages.removedFromProjectNotificationTitle,
                  "You are no longer a member of: \"" + project.title + "\" project").subscribe(() => {
                console.log('Deleted!');
                this.projectService.updateProjects();
              });
            });
          }
        },
        {
          text: 'Promote to owner',
          handler: () => {
            this.ownershipService.grantOwnershipToUser(project, member);
            console.log('Promoted');
            this.projectService.getProjectsByOwnerOrMember(this.loggedInUser).subscribe((projects: Project[]) => {
              this.data.changeUserProjects(projects);
            });
            this.projectService.getProjects().subscribe((projects: Project[]) => {
              this.data.changeProjects(projects);
            });
          }
        }]
    });
    await alert.present();
    let result = await alert.onDidDismiss();
    console.log(result);
  }

  async presentDeleteProjectAlert(project: Project) {
    const alert = await this.alertController.create({
      header: 'Deleting project!',
      message: 'You are deleting project: <p><strong>' + project.title + '</strong></p>',
      inputs: [
        {
          name: 'reason',
          type: 'text',
          placeholder: 'Specify reason'
        }
      ],
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
          handler: data => {
            this.projectService.deleteProject(project).subscribe(
                response => {
                  console.log(response);
                  this.notificationService.sendNotificationToProjectMembersAboutProjectDeletion(project, data.reason);
                  this.projectService.updateProjects();
                  this.toastService.showTemporarySuccessMessage("\"" + project.title + "\" deleted");
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
                  this.notificationService.sendNotificationToProjectMembersAboutProjectVerification(project);
                  this.projectService.updateProjects();
                  this.toastService.showTemporarySuccessMessage("\"" + project.title + "\" verified");
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

  async presentModifyProjectAlert(project: Project) {
    const alert = await this.alertController.create({
      header: 'Modifying project!',
      inputs: [
        {
          label: 'Title',
          name: 'title',
          placeholder: 'Title',
          value: project.title
        },
        {
          label: 'Description',
          name: 'description',
          placeholder: 'Description',
          value: project.description,
          type: "textarea"
        },
        {
          label: 'Technologies',
          name: 'technologies',
          placeholder: 'Technologies',
          value: project.technologies,
          type: "text"
        }
      ],
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          handler: () => {
            console.log('Canceled');
          }
        }, {
          text: 'SAVE',
          handler: data => {
            console.log(data);
            this.projectService.modifyProjectOnDataChange(project, data);
            this.projectService.modifyProject(project).subscribe(
                response => {
                  console.log(response);
                  this.projectService.updateProjects();
                  this.toastService.showTemporarySuccessMessage("\"" + project.title + "\" successfully modified");
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

  async presentDeleteCommentAlert(comment: Comment) {
    const alert = await this.alertController.create({
      header: 'Deleting comment!',
      message: 'You are deleting comment with content: <p><strong>' + comment.content + '</strong></p>',
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
            this.commentService.deleteComment(comment.id).subscribe(
                response => {
                  console.log(response);
                  this.commentService.getComments().subscribe((comments: Comment[]) => {
                    this.data.changeComments(comments);
                  });
                  this.toastService.showTemporarySuccessMessage(Messages.commentDeletedSuccessfullyMessage);
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

  async deleteEnrollmentRequest(project: Project, potentialMember: ProjectUser) {
    const alert = await this.alertController.create({
      header: 'Deleting project enrollment request!',
      message: 'You are rejecting enrollment request of: <p><strong>' + potentialMember.user.email + '</strong></p>',
      inputs: [
        {
          name: 'reason',
          type: 'text',
          placeholder: 'Specify reason'
        }
      ],
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
          handler: data => {
            this.membershipService.rejectMembershipRequest(project, potentialMember, data.reason);
          }
        }]
    });
    await alert.present();
    let result = await alert.onDidDismiss();
    console.log(result);
  }

  async cancelEnrollmentRequest(project: Project) {
    const alert = await this.alertController.create({
      header: 'Deleting project enrollment request!',
      message: 'You are deleting your enrollment request for project: <p><strong>' + project.title + '</strong></p>',
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
            this.authService.getCurrentUser().subscribe(
                (user: User) => {
                  console.log(user);
                  this.membershipService.deleteMemberFromProject(user, project).subscribe(
                      response => {
                        console.log(response);
                        this.projectService.updateProjects();
                        this.toastService.showTemporarySuccessMessage("Enrollment request for: \"" + project.title + "\" cancelled");
                      },
                      error => {
                        console.log(error);
                      });
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

  async presentDeleteUserAlert(user: User) {
    const alert = await this.alertController.create({
      header: 'Deleting user!',
      subHeader: user.firstName + ' ' + user.lastName,
      message: '<p>Email: <strong>' + user.email + '</strong></p>',
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
            this.authService.deleteUser(user).subscribe(
                response => {
                  console.log(response);
                  this.authService.getAllUsers().subscribe((users: User[]) => {
                    this.data.changeUsers(users);
                  });
                  this.toastService.showTemporarySuccessMessage("\"" + user.email + "\" deleted");
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

  async presentInvalidateProjectAlert(project: Project) {
    const alert = await this.alertController.create({
      header: 'Invalidating project project!',
      message: 'You are invalidating project: <p><strong>' + project.title + '</strong></p>',
      inputs: [
        {
          name: 'reason',
          type: 'text',
          placeholder: 'Specify reason'
        }
      ],
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          handler: () => {
            console.log('Canceled');
          }
        }, {
          text: 'INVALIDATE',
          handler: data => {
            this.projectService.invalidateProject(project).subscribe(
                response => {
                  console.log(response);
                  this.notificationService.sendNotificationToProjectMembersAboutProjectInvalidation(project, data.reason);
                  this.projectService.updateProjects();
                  this.toastService.showTemporarySuccessMessage("\"" + project.title + "\" invalidated");
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
}
