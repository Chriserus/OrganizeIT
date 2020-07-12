import {Component, OnDestroy, OnInit} from '@angular/core';
import {Project} from "../../interfaces/project.model";
import {Subject} from "rxjs";
import {ProjectService} from "../project.service";
import {finalize, takeUntil} from "rxjs/operators";
import {NotificationService} from "../../notifications/notification.service";
import {AuthService} from "../../authentication/auth.service";
import {User} from "../../interfaces/user.model";
import {ToastService} from "../../shared/toast.service";
import {Messages} from "../../shared/Messages";
import {MembershipService} from "../membership.service";
import {AlertService} from "../../shared/alert.service";
import {DataService} from "../../shared/data.service";
import {Scope} from "../../interfaces/scope.enum";

@Component({
  selector: 'app-list',
  templateUrl: 'list.page.html',
  styleUrls: ['list.page.scss']
})
export class ListPage implements OnInit, OnDestroy {
  projects: Project[];
  scope = Scope.LIST;
  private unsubscribe: Subject<Project[]> = new Subject();
  showProjectsSpinner: boolean;

  constructor(private projectService: ProjectService, private notificationService: NotificationService,
              private authService: AuthService, private membershipService: MembershipService,
              private toastService: ToastService, private alertService: AlertService, private data: DataService) {
    this.data.currentProjects.subscribe(projects => this.projects = projects.filter(project => project.verified));
  }

  ngOnInit() {
    this.data.currentProjects.subscribe(projects => this.projects = projects.filter(project => project.verified));
    this.getProjects();
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
          this.projectService.getProjects().subscribe((projects: Project[]) => {
            this.data.changeProjects(projects);
          });
        });
  }

  sendEnrollmentRequest(project: Project) {
    this.authService.getCurrentUser().subscribe((user: User) => {
      this.membershipService.addMemberToProject(user, project).subscribe(
          (response: any) => {
            this.sendNotificationAboutEnrollmentToProjectOwner(response, project);
          });
    })
  }

  private sendNotificationAboutEnrollmentToProjectOwner(response: any, project: Project) {
    project.owners.map(ownership => ownership.user).forEach(user => this.notificationService.sendNotification(user, "Enrollment request",
        sessionStorage.getItem("loggedInUserEmail") + " wants to join your project").subscribe(
        () => {
          this.toastService.showClosableInformationMessage(Messages.enrollmentRequestSentMessage);
          this.getProjects();
        },
        (error: any) => {
          console.log(error);
        }))
  }

  isUserLoggedIn(): boolean {
    return JSON.parse(sessionStorage.getItem("loggedIn"));
  }

  async doRefresh(event) {
    this.getProjects();
    event.target.complete();
  }
}
