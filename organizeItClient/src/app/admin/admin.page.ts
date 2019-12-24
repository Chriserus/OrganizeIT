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
// TODO: Add toast to inform, that approval was successful? Or that verification was successful? Project deleted?
export class AdminPage implements OnInit, OnDestroy {
  readonly RELOAD_DATA_EVENT_NAME = 'reloadProjectsAdminPage';
  projects: Project[] = [];
  private unsubscribe: Subject<Project[]> = new Subject();

  constructor(private projectService: ProjectService, private notificationService: NotificationService,
              private authService: AuthService, private membershipService: MembershipService,
              private events: Events, private alertService: AlertService) {
    this.listenForDataReloadEvent();
  }

  ngOnInit() {
    this.getProjects();
  }

  private listenForDataReloadEvent() {
    this.events.subscribe(this.RELOAD_DATA_EVENT_NAME, () => {
      this.getProjects();
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
    this.projects = [];
    this.projectService.getProjects().pipe(takeUntil(this.unsubscribe)).subscribe(projects => {
      console.log(projects);
      this.projects = projects;
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

  updateUser(form) {
    console.log(form.value);
    if (form.value.firstName === undefined || form.value.lastName === undefined) {
      return;
    }
    this.authService.getCurrentUser().subscribe((user: User) => {
      this.authService.updateInfo(form.value, user).subscribe(
          response => {
            console.log(response);
            location.reload();
          },
          error => {
            console.log(error);
          });
    });

  }
}
