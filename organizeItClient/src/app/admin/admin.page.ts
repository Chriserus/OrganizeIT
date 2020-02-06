import {Component, OnDestroy, OnInit} from '@angular/core';
import {Project} from "../interfaces/project.model";
import {Subject} from "rxjs";
import {ProjectService} from "../project/project.service";
import {finalize, takeUntil} from "rxjs/operators";
import {User} from "../interfaces/user.model";
import {NotificationService} from "../notifications/notification.service";
import {AuthService} from "../authentication/auth.service";
import {Events} from "@ionic/angular";
import {MembershipService} from "../project/membership.service";
import {AlertService} from "../shared/alert.service";

@Component({
  selector: 'app-admin',
  templateUrl: './admin.page.html',
  styleUrls: ['./admin.page.scss'],
})

export class AdminPage implements OnInit, OnDestroy {
  readonly RELOAD_DATA_EVENT_NAME = 'reloadProjectsAdminPage';
  readonly RELOAD_USERS_DATA_EVENT_NAME = 'reloadUsersAdminPage';
  projects: Project[] = [];
  unverifiedProjects: Project[] = [];
  verifiedProjects: Project[] = [];
  users: User[] = [];
  usersCopy: User[] = [];
  private unsubscribe: Subject<Project[]> = new Subject();
  showUnverifiedProjects: boolean;
  showVerifiedProjects: boolean;
  showUsersCard: boolean;
  showProjectsSpinner: boolean;
  showUsersSpinner: boolean;

  constructor(private projectService: ProjectService, private notificationService: NotificationService,
              private authService: AuthService, private membershipService: MembershipService,
              private events: Events, private alertService: AlertService) {
    this.listenForDataReloadEvent();
    this.showUnverifiedProjects = true;
    this.showVerifiedProjects = true;
    this.showUsersCard = true;
  }

  ngOnInit() {
    this.getProjects();
    this.getUsers();
  }

  private listenForDataReloadEvent() {
    this.events.subscribe(this.RELOAD_DATA_EVENT_NAME, () => {
      this.getProjects();
    });
    this.events.subscribe(this.RELOAD_USERS_DATA_EVENT_NAME, () => {
      this.getUsers();
    });
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
          console.log(projects);
          this.projects = projects;
          this.unverifiedProjects = projects.filter(project => !project.verified);
          this.verifiedProjects = projects.filter(project => project.verified);
        });
  }

  getUsers() {
    this.showUsersSpinner = true;
    this.authService.getAllUsers().pipe(takeUntil(this.unsubscribe))
        .pipe(finalize(async () => {
          this.showUsersSpinner = false;
        }))
        .subscribe(users => {
          console.log(users);
          this.users = users;
          this.usersCopy = users;
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

  segmentChanged($event: CustomEvent) {
    
  }
}
