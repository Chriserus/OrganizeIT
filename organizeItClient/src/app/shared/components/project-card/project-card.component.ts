import {Component, Input, OnInit} from '@angular/core';
import {Project} from "../../../interfaces/project.model";
import {ProjectService} from "../../../project/project.service";
import {Scope} from "../../../interfaces/scope.enum";
import {MembershipService} from "../../../project/membership.service";
import {AlertService} from "../../alert.service";
import {User} from "../../../interfaces/user.model";
import {Messages} from "../../Messages";
import {NotificationService} from "../../../notifications/notification.service";
import {AuthService} from "../../../authentication/auth.service";
import {ToastService} from "../../toast.service";
import {DataService} from "../../data.service";

@Component({
    selector: 'app-project-card',
    templateUrl: './project-card.component.html',
    styleUrls: ['./project-card.component.scss'],
})
export class ProjectCardComponent implements OnInit {

    @Input()
    project: Project;
    @Input()
    scope: Scope;
    loggedInUser: User;

    constructor(public projectService: ProjectService, private notificationService: NotificationService,
                private authService: AuthService, public membershipService: MembershipService,
                private toastService: ToastService, public alertService: AlertService, private data: DataService) {
        this.authService.getCurrentUser().subscribe((user: User) => {
            this.loggedInUser = user;
        });
    }

    ngOnInit() {
    }

    get isList() {
        return this.scope === Scope.LIST;
    }

    isUserLoggedIn(): boolean {
        return JSON.parse(sessionStorage.getItem("loggedIn"));
    }

    sendEnrollmentRequest(project: Project) {
        this.authService.getCurrentUser().subscribe((user: User) => {
            this.membershipService.addMemberToProject(user, project).subscribe(
                (response: any) => {
                    this.sendNotificationAboutEnrollmentToProjectOwner(response, project);
                    this.getProjects();
                });
        })
    }

    private sendNotificationAboutEnrollmentToProjectOwner(response: any, project: Project) {
        project.owners.map(ownership => ownership.user).forEach(user => this.notificationService.sendNotification(user, "Enrollment request",
            sessionStorage.getItem("loggedInUserEmail") + " wants to join your project").subscribe(
            () => {
                this.toastService.showClosableInformationMessage(Messages.enrollmentRequestSentMessage);
            },
            (error: any) => {
                console.log(error);
            }))
    }

    isProjectOwner(project: Project) {
        return project.owners.map(owner => owner.user.email).filter(userEmail => userEmail === sessionStorage.getItem("loggedInUserEmail")).length != 0
    }

    listPotentialMembers(project: Project) {
        return project.members.filter(member => !member.approved);
    }

    projectHasRequests(project: Project) {
        return this.listPotentialMembers(project).length
    }
}
