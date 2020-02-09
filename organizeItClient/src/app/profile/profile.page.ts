import {Component, OnDestroy, OnInit} from '@angular/core';
import {finalize, takeUntil} from "rxjs/operators";
import {ProjectService} from "../project/project.service";
import {Project} from "../interfaces/project.model";
import {Subject} from "rxjs";
import {NotificationService} from "../notifications/notification.service";
import {AuthService} from "../authentication/auth.service";
import {Messages} from "../shared/Messages";
import {User} from "../interfaces/user.model";
import {MembershipService} from "../project/membership.service";
import {ToastService} from "../shared/toast.service";
import {ShirtType} from "../interfaces/shirt-type.enum";
import {ShirtSize} from "../interfaces/shirt-size";
import {AlertService} from "../shared/alert.service";
import {City} from "../interfaces/city.enum";
import {Notification} from "../interfaces/notification";
import {DataService} from "../shared/data.service";

@Component({
  selector: 'app-profile',
  templateUrl: './profile.page.html',
  styleUrls: ['./profile.page.scss'],
})
export class ProfilePage implements OnInit, OnDestroy {
  readonly RELOAD_DATA_EVENT_NAME = 'reloadProjectsProfilePage';
  projects: Project[];
  notifications: Notification[] = [];
  private unsubscribe: Subject<Project[]> = new Subject();
  loggedInUser: User;
  firstName: String;
  lastName: String;
  shirtSize: ShirtSize;
  shirtType: ShirtType;
  city: City;
  shirtSizes: ShirtSize[];
  shirtTypes: ShirtType[] = [ShirtType.M, ShirtType.F];
  cities: City[] = [City.WRO, City.POZ];
  showProjectsSpinner: boolean;
  showNotificationsSpinner: boolean;

  constructor(private projectService: ProjectService, private notificationService: NotificationService,
              private authService: AuthService, private membershipService: MembershipService,
              private toastService: ToastService, private alertService: AlertService, private data: DataService) {
    this.data.currentUserProjects.subscribe(projects => this.projects = projects);
    this.data.currentUser.subscribe(user => this.loggedInUser = user);
    this.data.currentUserNotifications.subscribe(notifications => this.notifications = notifications);
    this.authService.getAllShirtSizes().subscribe((shirtSizes: ShirtSize[]) => {
      this.shirtSizes = shirtSizes;
      this.authService.getCurrentUser().subscribe((user: User) => {
        this.loggedInUser = user;
        this.firstName = user.firstName;
        this.lastName = user.lastName;
        this.shirtSize = user.shirtSize;
        this.shirtType = user.shirtType;
        this.city = user.city;
        this.getProjects();
        this.getNotifications();
      });
    })
  }

  ngOnInit() {
    this.data.currentUserProjects.subscribe(projects => this.projects = projects);
    this.data.currentUser.subscribe(user => this.loggedInUser = user);
    this.data.currentUserNotifications.subscribe(notifications => this.notifications = notifications);
  }

  compareShirtSizes(s1: ShirtSize, s2: ShirtSize) {
    return s1 && s2 ? s1.id === s2.id : s1 === s2;
  }

  ngOnDestroy() {
    this.unsubscribe.next();
    this.unsubscribe.complete();
  }

  getProjects() {
    this.showProjectsSpinner = true;
    this.projectService.getProjectsByOwnerOrMember(this.loggedInUser).pipe(takeUntil(this.unsubscribe))
        .pipe(finalize(async () => {
          this.showProjectsSpinner = false;
        }))
        .subscribe(projects => {
          console.log(projects);
          this.data.changeUserProjects(projects);
        });
  }

  private getNotifications() {
    this.showNotificationsSpinner = true;
    this.notificationService.getNotificationsByRecipient(this.loggedInUser).pipe(takeUntil(this.unsubscribe))
        .pipe(finalize(async () => {
          this.showNotificationsSpinner = false;
        }))
        .subscribe((notifications: Notification[]) => {
          console.log(notifications);
          this.data.changeUserNotifications(notifications);
        });
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

  updateUser(form) {
    console.log(form.value);
    if (this.userDataUnchanged(form)) {
      this.toastService.showTemporaryWarningMessage(Messages.userInfoUpdateWarningMessage);
      return;
    }
    this.authService.updateInfo(form.value, this.loggedInUser).subscribe(
        (user: User) => {
          console.log(user);
          this.data.changeCurrentUser(user);
          this.toastService.showTemporarySuccessMessage(Messages.userInfoUpdateSuccessMessage);
        },
        error => {
          console.log(error);
          this.toastService.showTemporaryErrorMessage(Messages.userInfoUpdateErrorMessage);
        });
  }

  private userDataUnchanged(form) {
    return this.loggedInUser.firstName === form.value.firstName && this.loggedInUser.lastName === form.value.lastName
        && this.compareShirtSizes(this.loggedInUser.shirtSize, form.value.shirtSize) && this.loggedInUser.shirtType === form.value.shirtType
        && this.loggedInUser.city === form.value.city;
  }

  async doRefresh(event) {
    this.getProjects();
    this.getNotifications();
    event.target.complete();
  }
}
