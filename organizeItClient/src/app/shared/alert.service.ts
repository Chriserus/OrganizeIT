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
import {City} from "../interfaces/city.enum";

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
                    }
                }, {
                    text: 'DELETE',
                    cssClass: 'danger',
                    handler: () => {
                        this.membershipService.deleteMemberFromProject(member, project).subscribe(() => {
                            this.notificationService.sendNotification(member, Messages.removedFromProjectNotificationTitle,
                                "You are no longer a member of: \"" + project.title + "\" project").subscribe(() => {
                                this.projectService.updateProjects();
                            });
                        });
                    }
                },
                {
                    text: 'Promote to owner',
                    handler: () => {
                        if (this.projectService.userIsProjectOwner(member, project)) {
                            this.ownershipService.grantOwnershipToUser(project, member);
                            this.projectService.getProjectsByOwnerOrMember(this.loggedInUser).subscribe((projects: Project[]) => {
                                this.data.changeUserProjects(projects);
                            });
                            this.projectService.getProjects().subscribe((projects: Project[]) => {
                                this.data.changeProjects(projects);
                            });
                        }
                    }
                }]
        });
        await alert.present();
        let result = await alert.onDidDismiss();
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
                    }
                }, {
                    text: 'DELETE',
                    cssClass: 'danger',
                    handler: data => {
                        this.projectService.deleteProject(project).subscribe(
                            () => {
                                this.notificationService.sendNotificationToProjectMembersAboutProjectDeletion(project, data.reason);
                                this.projectService.updateProjects();
                                this.toastService.showTemporarySuccessMessage("\"" + project.title + "\" deleted");
                            },
                            () => {
                                this.toastService.showTemporaryErrorMessage("\"" + project.title + "\" not deleted");
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
                            () => {
                                this.notificationService.sendNotificationToProjectMembersAboutProjectVerification(project);
                                this.projectService.updateProjects();
                                this.toastService.showTemporarySuccessMessage("\"" + project.title + "\" verified");
                            },
                            () => {
                                this.toastService.showTemporaryErrorMessage("\"" + project.title + "\" not verified");
                            });
                    }
                }]
        });
        await alert.present();
        let result = await alert.onDidDismiss();
    }

    async presentModifyProjectAlert(project: Project) {
        const alert = await this.alertController.create({
            header: 'Modifying project!',
            cssClass: 'modify-project-alert',
            inputs: [
                {
                    name: 'title',
                    placeholder: 'Title',
                    value: project.title
                },
                {
                    name: 'description',
                    placeholder: 'Description',
                    value: project.description,
                    type: "textarea"
                },
                {
                    name: 'technologies',
                    placeholder: 'Technologies',
                    value: project.technologies,
                    type: "text"
                },
                {
                    name: 'maxMembers',
                    value: project.maxMembers,
                    min: 1,
                    max: 5,
                    type: "number"
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
                        this.projectService.modifyProjectOnDataChange(project, data);
                        this.projectService.modifyProject(project).subscribe(
                            () => {
                                this.projectService.updateProjects();
                                this.toastService.showTemporarySuccessMessage("\"" + project.title + "\" successfully modified");
                            },
                            () => {
                                this.toastService.showTemporaryErrorMessage("\"" + project.title + "\" not modified");
                            });
                    }
                }]
        });
        await alert.present();
        let result = await alert.onDidDismiss();
        console.log(result);
    }

    async presentModifyProjectCityAlert(project: Project) {
        const alert = await this.alertController.create({
            header: 'Modifying city!',
            inputs: [
                {
                    name: 'wro',
                    type: 'radio',
                    label: 'Wro',
                    value: City.WRO,
                    checked: project.city === City.WRO
                },
                {
                    name: 'poz',
                    type: 'radio',
                    label: 'Poz',
                    value: City.POZ,
                    checked: project.city === City.POZ
                }],
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
                        project.city = data;
                        this.projectService.modifyProject(project).subscribe(
                            () => {
                                this.projectService.updateProjects();
                                this.toastService.showTemporarySuccessMessage("\"" + project.title + "\" city modified");
                            },
                            () => {
                                this.toastService.showTemporaryErrorMessage("\"" + project.title + "\" city not modified");
                            });
                    }
                }]
        });
        await alert.present();
        let result = await alert.onDidDismiss();
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
                    }
                }, {
                    text: 'DELETE',
                    cssClass: 'danger',
                    handler: () => {
                        this.commentService.deleteComment(comment.id).subscribe(
                            () => {
                                this.commentService.getComments().subscribe((comments: Comment[]) => {
                                    this.data.changeComments(comments);
                                });
                                this.toastService.showTemporarySuccessMessage(Messages.commentDeletedSuccessfullyMessage);
                            },
                            () => {
                                this.toastService.showTemporaryErrorMessage(Messages.commentDeletedErrorMessage);
                            });
                    }
                }]
        });
        await alert.present();
        let result = await alert.onDidDismiss();
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
                    }
                }, {
                    text: 'DELETE',
                    cssClass: 'danger',
                    handler: () => {
                        this.authService.getCurrentUser().subscribe(
                            (user: User) => {
                                this.membershipService.deleteMemberFromProject(user, project).subscribe(
                                    () => {
                                        this.projectService.updateProjects();
                                        this.toastService.showTemporarySuccessMessage("Enrollment request for: \"" + project.title + "\" cancelled");
                                    },
                                    () => {
                                        this.toastService.showTemporaryErrorMessage("Enrollment request for: \"" + project.title + "\" not cancelled");
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
                            () => {
                                this.authService.getAllUsers().subscribe((users: User[]) => {
                                    this.data.changeUsers(users);
                                });
                                this.toastService.showTemporarySuccessMessage("\"" + user.email + "\" deleted");
                            },
                            () => {
                                this.toastService.showTemporaryErrorMessage("\"" + user.email + "\" not deleted");
                            });
                    }
                }]
        });
        await alert.present();
        let result = await alert.onDidDismiss();
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
                            () => {
                                this.notificationService.sendNotificationToProjectMembersAboutProjectInvalidation(project, data.reason);
                                this.projectService.updateProjects();
                                this.toastService.showTemporarySuccessMessage("\"" + project.title + "\" invalidated");
                            },
                            () => {
                                this.toastService.showTemporaryErrorMessage("\"" + project.title + "\" not invalidated");
                            });
                    }
                }]
        });
        await alert.present();
        let result = await alert.onDidDismiss();
    }

    async presentConfirmProjectAlert(project: Project) {
        const alert = await this.alertController.create({
            header: 'Confirming project!',
            message: 'You are confirming project: <p><strong>' + project.title + '</strong></p>',
            buttons: [
                {
                    text: 'Cancel',
                    role: 'cancel',
                    handler: () => {
                    }
                }, {
                    text: 'CONFIRM',
                    handler: () => {
                        this.projectService.confirmProject(project).subscribe(
                            () => {
                                this.notificationService.sendNotificationToProjectMembersAboutProjectConfirmation(project);
                                this.projectService.updateProjects();
                                this.toastService.showTemporarySuccessMessage("\"" + project.title + "\" confirmed");
                            },
                            () => {
                                this.toastService.showTemporaryErrorMessage("\"" + project.title + "\" not confirmed");
                            });
                    }
                }]
        });
        await alert.present();
        let result = await alert.onDidDismiss();
        console.log(result);
    }

    async presentUnconfirmProjectAlert(project: Project) {
        const alert = await this.alertController.create({
            header: 'Unconfirming project project!',
            message: 'You are unconfirming project: <p><strong>' + project.title + '</strong></p>',
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
                    }
                }, {
                    text: 'UNCONFIRM',
                    handler: data => {
                        this.projectService.unconfirmProject(project).subscribe(
                            () => {
                                this.notificationService.sendNotificationToProjectMembersAboutProjectUnconfirmation(project, data.reason);
                                this.projectService.updateProjects();
                                this.toastService.showTemporarySuccessMessage("\"" + project.title + "\" unconfirmed");
                            },
                            () => {
                                this.toastService.showTemporaryErrorMessage("\"" + project.title + "\" not unconfirmed");
                            });
                    }
                }]
        });
        await alert.present();
        let result = await alert.onDidDismiss();
    }

    async presentGiveAdminRightsAlert(user: User) {
        const alert = await this.alertController.create({
            header: 'Promoting to administrator!',
            subHeader: user.firstName + ' ' + user.lastName,
            message: '<p>Email: <strong>' + user.email + '</strong></p>',
            buttons: [
                {
                    text: 'Cancel',
                    role: 'cancel',
                    handler: () => {
                    }
                }, {
                    text: 'PROMOTE',
                    handler: () => {
                        this.authService.giveAdminRights(user).subscribe(
                            () => {
                                this.authService.getAllUsers().subscribe((users: User[]) => {
                                    this.data.changeUsers(users);
                                });
                                this.toastService.showTemporarySuccessMessage("\"" + user.email + "\" promoted to administrator");
                            },
                            () => {
                                this.toastService.showTemporaryErrorMessage("\"" + user.email + "\" not promoted to administrator");
                            });
                    }
                }]
        });
        await alert.present();
        let result = await alert.onDidDismiss();
    }

    async presentRevokeAdminRightsAlert(user: User) {
        const alert = await this.alertController.create({
            header: 'Revoking administrator rights!',
            subHeader: user.firstName + ' ' + user.lastName,
            message: '<p>Email: <strong>' + user.email + '</strong></p>',
            buttons: [
                {
                    text: 'Cancel',
                    role: 'cancel',
                    handler: () => {
                    }
                }, {
                    text: 'REVOKE',
                    cssClass: 'danger',
                    handler: () => {
                        this.authService.revokeAdminRights(user).subscribe(
                            () => {
                                this.authService.getAllUsers().subscribe((users: User[]) => {
                                    this.data.changeUsers(users);
                                });
                                this.toastService.showTemporarySuccessMessage("\"" + user.email + "\" - administrator rights revoked");
                            },
                            () => {
                                this.toastService.showTemporaryErrorMessage("\"" + user.email + "\" - administrator rights not revoked");
                            });
                    }
                }]
        });
        await alert.present();
        let result = await alert.onDidDismiss();
        console.log(result);
    }
}
