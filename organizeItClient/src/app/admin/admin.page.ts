import {Component, OnDestroy, OnInit} from '@angular/core';
import {Project} from "../interfaces/project.model";
import {Subject} from "rxjs";
import {ProjectService} from "../project/project.service";
import {takeUntil} from "rxjs/operators";
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
  private unsubscribe: Subject<Project[]> = new Subject();
  showUnverifiedProjects: boolean;
  showVerifiedProjects: boolean;
  showUsersCard: boolean;

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
    return JSON.parse(localStorage.getItem("loggedIn")) === true;
  }

  ngOnDestroy() {
    this.unsubscribe.next();
    this.unsubscribe.complete();
  }

  getProjects() {
    this.projectService.getProjects().pipe(takeUntil(this.unsubscribe)).subscribe(projects => {
      console.log(projects);
      this.projects = projects;
      this.unverifiedProjects = projects.filter(project => !project.verified);
      this.verifiedProjects = projects.filter(project => project.verified);
    });
  }

  getUsers() {
    this.authService.getAllUsers().pipe(takeUntil(this.unsubscribe)).subscribe(users => {
      console.log(users);
      this.users = users;
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

  async doRefresh(event) {
    this.getProjects();
    event.target.complete();
  }
}
