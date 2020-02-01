import {Injectable} from '@angular/core';
import {Project} from "../interfaces/project.model";
import {AlertController, Events} from "@ionic/angular";
import {ProjectService} from "../project/project.service";
import {NotificationService} from "../notifications/notification.service";
import {Comment} from "../interfaces/comment.model";
import {CommentService} from "../comment/comment.service";
import {User} from "../interfaces/user.model";
import {AuthService} from "../authentication/auth.service";
import {MembershipService} from "../project/membership.service";
import {ToastService} from "./toast.service";
import {ProjectUser} from "../interfaces/project-user";

@Injectable({
  providedIn: 'root'
})
export class AlertService {

  constructor(private alertController: AlertController, private projectService: ProjectService,
              private notificationService: NotificationService, private events: Events,
              private commentService: CommentService, private authService: AuthService,
              private membershipService: MembershipService, private toastService: ToastService) {
  }

  async presentDeleteProjectAlert(project: Project, eventName: string) {
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
                  this.events.publish(eventName);
                  this.toastService.showTemporarySuccessMessage("Project: " + project.title + " successfully deleted");
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

  async presentVerifyProjectAlert(project: Project, eventName: string) {
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
                  this.events.publish(eventName);
                  this.toastService.showTemporarySuccessMessage("Project: " + project.title + " successfully verified");
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

  async presentModifyProjectAlert(project: Project, eventName: string) {
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
          type: "text" // TODO: Known bug: no textarea, formatting does not work -> Ionic team is working on adding it
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
                  this.events.publish(eventName);
                  this.toastService.showTemporarySuccessMessage("Project: " + project.title + " successfully modified");
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

  async presentDeleteCommentAlert(comment: Comment, eventName: string) {
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
                  this.events.publish(eventName);
                  this.toastService.showTemporarySuccessMessage("Comment successfully deleted");
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

  async deleteEnrollmentRequest(project: Project, potentialMember: ProjectUser, eventName: string) {
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
            this.membershipService.rejectMembershipRequest(project, potentialMember, data.reason, eventName);
          }
        }]
    });
    await alert.present();
    let result = await alert.onDidDismiss();
    console.log(result);
  }

  async cancelEnrollmentRequest(project: Project, eventName: string) {
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
                        this.events.publish(eventName);
                        this.toastService.showTemporarySuccessMessage("Enrollment request for project: " + project.title + " successfully cancelled");
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

  async presentDeleteUserAlert(user: User, eventName: string) {
    const alert = await this.alertController.create({
      header: 'Deleting user!',
      message: user.firstName + ' ' + user.lastName + '<p>Email: <strong>' + user.email + '</strong></p>',
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
            this.authService.deleteUser(user).subscribe(
                response => {
                  console.log(response);
                  this.events.publish(eventName);
                  this.toastService.showTemporarySuccessMessage("User: " + user.email + " successfully deleted");
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
