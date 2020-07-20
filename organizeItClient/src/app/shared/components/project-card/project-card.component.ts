import {Component, Input, OnInit} from '@angular/core';
import {Project} from "../../../interfaces/project.model";
import {ProjectService} from "../../../project/project.service";
import {Scope} from "../../../interfaces/scope.enum";
import {MembershipService} from "../../../project/membership.service";
import {AlertService} from "../../alert.service";
import {User} from "../../../interfaces/user.model";
import {NotificationService} from "../../../notifications/notification.service";
import {AuthService} from "../../../authentication/auth.service";

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
                public alertService: AlertService) {
        this.authService.getCurrentUser().subscribe((user: User) => {
            this.loggedInUser = user;
        });
    }

    ngOnInit() {
    }

    get isList() {
        return this.scope === Scope.LIST;
    }

    get isAdminUnverified() {
        return this.scope === Scope.ADMIN_UNVERIFIED;
    }

    get isAdminVerified() {
        return this.scope === Scope.ADMIN_VERIFIED;
    }

    get isAdminConfirmed() {
        return this.scope === Scope.ADMIN_CONFIRMED;
    }

    isUserLoggedIn(): boolean {
        return JSON.parse(sessionStorage.getItem("loggedIn"));
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
