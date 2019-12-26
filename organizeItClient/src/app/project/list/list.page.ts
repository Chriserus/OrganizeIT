import {Component, OnDestroy, OnInit} from '@angular/core';
import {Project} from "../../interfaces/project.model";
import {Subject} from "rxjs";
import {ProjectService} from "../project.service";
import {takeUntil} from "rxjs/operators";
import {NotificationService} from "../../notifications/notification.service";
import {AuthService} from "../../authentication/auth.service";
import {User} from "../../interfaces/user.model";
import {ToastService} from "../../shared/toast.service";
import {Messages} from "../../shared/Messages";
import {MembershipService} from "../membership.service";
import {Events} from "@ionic/angular";
import {AlertService} from "../../shared/alert.service";

@Component({
  selector: 'app-list',
  templateUrl: 'list.page.html',
  styleUrls: ['list.page.scss']
})
export class ListPage implements OnInit, OnDestroy {
  readonly RELOAD_DATA_EVENT_NAME = 'reloadProjectsListPage';
  projects: Project[] = [];
  private unsubscribe: Subject<Project[]> = new Subject();

  constructor(private projectService: ProjectService, private notificationService: NotificationService,
              private authService: AuthService, private membershipService: MembershipService,
              private toastService: ToastService, private events: Events,
              private alertService: AlertService) {
    this.listenForDataReloadEvent();
  }

  ngOnInit() {
    this.getProjects();
  }

  ngOnDestroy() {
    this.unsubscribe.next();
    this.unsubscribe.complete();
  }

  // TODO: Create clustered index of verified projects
  getProjects() {
    this.projectService.getProjects().pipe(takeUntil(this.unsubscribe)).subscribe(projects => {
      console.log(projects);
      this.projects = projects.filter(project => project.verified);
    });
  }

  sendEnrollmentRequest(project: Project) {
    console.log("Adding member: " + localStorage.getItem("loggedInUserEmail") + " to project: " + project.title);
    this.authService.getCurrentUser().subscribe((user: User) => {
      this.membershipService.addMemberToProject(user, project).subscribe(
          (response: any) => {
            this.sendNotificationAboutEnrollmentToProjectOwner(response, project);
          });
    })
  }

  private sendNotificationAboutEnrollmentToProjectOwner(response: any, project: Project) {
    console.log(response);
    this.notificationService.sendNotification(project.owner, "Enrollment request",
        "User " + localStorage.getItem("loggedInUserEmail") + " wants to join your project").subscribe(
        (response: any) => {
          console.log(response);
          this.toastService.showClosableInformationMessage(Messages.enrollmentRequestSentMessage);
          this.getProjects();
        },
        (error: any) => {
          console.log(error);
        });
  }

  isUserLoggedIn(): boolean {
    return JSON.parse(localStorage.getItem("loggedIn"));
  }

  private listenForDataReloadEvent() {
    this.events.subscribe(this.RELOAD_DATA_EVENT_NAME, () => {
      this.getProjects();
    });
  }

  async doRefresh(event) {
    this.getProjects();
    event.target.complete();
  }
}
