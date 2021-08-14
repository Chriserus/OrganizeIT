import {Component, OnDestroy, OnInit} from '@angular/core';
import {Project} from "../interfaces/project.model";
import {Subject} from "rxjs";
import {ProjectService} from "../project/project.service";
import {finalize, takeUntil} from "rxjs/operators";
import {User} from "../interfaces/user.model";
import {NotificationService} from "../notifications/notification.service";
import {AuthService} from "../authentication/auth.service";
import {MembershipService} from "../project/membership.service";
import {AlertService} from "../shared/alert.service";
import {DataService} from "../shared/data.service";
import {Scope} from "../interfaces/scope.enum";

@Component({
    selector: 'app-admin',
    templateUrl: './admin.page.html',
    styleUrls: ['./admin.page.scss'],
})

export class AdminPage implements OnInit, OnDestroy {
    projects: Project[] = [];
    unverifiedProjects: Project[] = [];
    verifiedProjects: Project[] = [];
    confirmedProjects: Project[] = [];
    users: User[] = [];
    usersCopy: User[] = [];
    private unsubscribe: Subject<Project[]> = new Subject();
    showUnverifiedProjects: boolean = true;
    showVerifiedProjects: boolean = true;
    showConfirmedProjects: boolean = true;
    showUsersCard: boolean = true;
    showProjectsSpinner: boolean;
    showUsersSpinner: boolean;
    scopeUnverified = Scope.ADMIN_UNVERIFIED;
    scopeVerified = Scope.ADMIN_VERIFIED;
    scopeConfirmed = Scope.ADMIN_CONFIRMED;

    constructor(private projectService: ProjectService, private notificationService: NotificationService,
                public authService: AuthService, private membershipService: MembershipService,
                public alertService: AlertService, private data: DataService) {
        this.data.currentProjects.subscribe(projects => {
            this.projects = projects;
            this.unverifiedProjects = projects.filter(project => !project.verified);
            this.verifiedProjects = projects.filter(project => project.verified);
            this.confirmedProjects = projects.filter(project => project.confirmed);
        });
        this.data.currentUsers.subscribe(users => {
            this.users = users;
            this.usersCopy = users;
        });
    }

    ngOnInit() {
        this.data.currentProjects.subscribe(projects => {
            this.projects = projects;
            this.unverifiedProjects = projects.filter(project => !project.verified);
            this.verifiedProjects = projects.filter(project => project.verified);
        });
        this.getProjects();
        this.getUsers();
    }

    isUserLoggedIn() {
        return JSON.parse(sessionStorage.getItem("loggedIn")) === true;
    }

    ngOnDestroy() {
        this.unsubscribe.next();
        this.unsubscribe.complete();
    }

    getProjects() {
        this.showProjectsSpinner = true;
        this.projectService.getProjects().pipe(takeUntil(this.unsubscribe))
            .pipe(finalize(async () => {
                this.showProjectsSpinner = false;
            }))
            .subscribe(projects => {
                this.data.changeProjects(projects);
            });
    }

    getUsers() {
        this.showUsersSpinner = true;
        this.authService.getAllUsers().pipe(takeUntil(this.unsubscribe))
            .pipe(finalize(async () => {
                this.showUsersSpinner = false;
            }))
            .subscribe(users => {
                this.data.changeUsers(users);
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
        return project.owners.map(owner => owner.user.email).filter(userEmail => userEmail === sessionStorage.getItem("loggedInUserEmail")).length != 0
    }

    async doRefresh(event) {
        this.getProjects();
        this.getUsers();
        event.target.complete();
    }

    onSearchChange(event) {
        this.users = this.usersCopy;
        let value = event.target.value;
        if (value && value.trim() != '') {
            this.users = this.users.filter(user => {
                return this.authService.isValuePresentInUserFields(user, value);
            })
        }
    }
}
