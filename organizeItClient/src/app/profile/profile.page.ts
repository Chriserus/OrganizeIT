import {Component, OnDestroy, OnInit} from '@angular/core';
import {takeUntil} from "rxjs/operators";
import {ProjectService} from "../project/project.service";
import {Project} from "../interfaces/project.model";
import {Subject} from "rxjs";
import {NotificationService} from "../notifications/notification.service";
import {AuthService} from "../authentication/auth.service";
import {Events} from "@ionic/angular";
import {Messages} from "../shared/Messages";
import {User} from "../interfaces/user.model";
import {MembershipService} from "../project/membership.service";
import {ToastService} from "../shared/toast.service";
import {ShirtType} from "../interfaces/shirt-type.enum";
import {ShirtSize} from "../interfaces/shirt-size";
import {AlertService} from "../shared/alert.service";

@Component({
  selector: 'app-profile',
  templateUrl: './profile.page.html',
  styleUrls: ['./profile.page.scss'],
})
export class ProfilePage implements OnInit, OnDestroy {
  readonly RELOAD_DATA_EVENT_NAME = 'reloadProjectsProfilePage';
  projects: Project[] = [];
  private unsubscribe: Subject<Project[]> = new Subject();
  loggedInUser: User;
  firstName: String;
  lastName: String;
  shirtSize: ShirtSize;
  shirtType: ShirtType;
  shirtSizes: ShirtSize[];
  shirtTypes: ShirtType[] = [ShirtType.M, ShirtType.F];

  constructor(private projectService: ProjectService, private notificationService: NotificationService,
              private authService: AuthService, private membershipService: MembershipService, private events: Events,
              private toastService: ToastService, private alertService: AlertService) {
    this.listenForDataReloadEvent();
    this.authService.getAllShirtSizes().subscribe((shirtSizes: ShirtSize[]) => {
      this.shirtSizes = shirtSizes;
      this.authService.getCurrentUser().subscribe((user: User) => {
        this.loggedInUser = user;
        this.firstName = user.firstName;
        this.lastName = user.lastName;
        this.shirtSize = user.shirtSize;
        this.shirtType = user.shirtType;
        this.getProjects();
      });
    })
  }

  ngOnInit() {
  }

  compareShirtSizes(s1: ShirtSize, s2: ShirtSize) {
    return s1 && s2 ? s1.id === s2.id : s1 === s2;
  }

  ngOnDestroy() {
    this.unsubscribe.next();
    this.unsubscribe.complete();
  }

  getProjects() {
    this.projectService.getProjectsByOwnerOrMember(this.loggedInUser).pipe(takeUntil(this.unsubscribe)).subscribe(projects => {
      console.log(projects);
      this.projects = projects;
    });
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
    if (this.userDataUnchanged(form)) {
      this.toastService.showTemporaryWarningMessage(Messages.userInfoUpdateWarningMessage);
      return;
    }
    this.authService.updateInfo(form.value, this.loggedInUser).subscribe(
        (user: User) => {
          console.log(user);
          this.loggedInUser = user;
          this.events.publish('reloadSideMenuData');
          this.toastService.showTemporarySuccessMessage(Messages.userInfoUpdateSuccessMessage);
        },
        error => {
          console.log(error);
          this.toastService.showTemporaryErrorMessage(Messages.userInfoUpdateErrorMessage);
        });
  }

  private userDataUnchanged(form) {
    return this.loggedInUser.firstName === form.value.firstName && this.loggedInUser.lastName === form.value.lastName
        && this.compareShirtSizes(this.loggedInUser.shirtSize, form.value.shirtSize) && this.loggedInUser.shirtType === form.value.shirtType;
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
