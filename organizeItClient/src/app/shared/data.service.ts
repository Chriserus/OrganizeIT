import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import {Project} from "../interfaces/project.model";
import {User} from "../interfaces/user.model";
import {Notification} from "../interfaces/notification";
import {Comment} from "../interfaces/comment.model";

@Injectable({
  providedIn: 'root'
})
export class DataService {
  private projectsSource = new BehaviorSubject([]);
  currentProjects = this.projectsSource.asObservable();
  private userProjectsSource = new BehaviorSubject([]);
  currentUserProjects = this.userProjectsSource.asObservable();
  private usersSource = new BehaviorSubject([]);
  currentUsers = this.usersSource.asObservable();
  private userNotificationsSource = new BehaviorSubject([]);
  currentUserNotifications = this.userNotificationsSource.asObservable();
  private commentsSource = new BehaviorSubject([]);
  currentComments = this.commentsSource.asObservable();
  private currentUserSource = new BehaviorSubject<User>(null);
  currentUser = this.currentUserSource.asObservable();

  constructor() { }

  changeProjects(projects: Project[]) {
    this.projectsSource.next(projects)
  }

  changeUserProjects(projects: Project[]) {
    this.userProjectsSource.next(projects)
  }

  changeUsers(users: User[]) {
    this.usersSource.next(users)
  }

  changeComments(comments: Comment[]) {
    this.commentsSource.next(comments)
  }

  changeUserNotifications(notifications: Notification[]) {
    this.userNotificationsSource.next(notifications)
  }

  changeCurrentUser(user: User) {
    this.currentUserSource.next(user);
  }

}
