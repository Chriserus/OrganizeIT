import {Injectable} from '@angular/core';
import {Project} from "../interfaces/project.model";
import {AlertController, Events} from "@ionic/angular";
import {ProjectService} from "../project/project.service";
import {NotificationService} from "../notifications/notification.service";
import {Comment} from "../interfaces/comment.model";
import {CommentService} from "../comment/comment.service";

@Injectable({
  providedIn: 'root'
})
export class AlertService {

  constructor(private alertController: AlertController, private projectService: ProjectService,
              private notificationService: NotificationService, private events: Events,
              private commentService: CommentService) {
  }

  async presentDeleteProjectAlert(project: Project, eventName: string) {
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
                  this.notificationService.sendNotificationToProjectMembersAboutProjectDeletion(project);
                  this.events.publish(eventName);
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
