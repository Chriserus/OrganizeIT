import {Component, OnDestroy, OnInit} from '@angular/core';
import {Project} from "../interfaces/project.model";
import {Subject} from "rxjs";
import {ProjectService} from "../project/project.service";
import {takeUntil} from "rxjs/operators";
import {NotificationService} from "../notifications/notification.service";

@Component({
  selector: 'app-list',
  templateUrl: 'list.page.html',
  styleUrls: ['list.page.scss']
})
export class ListPage implements OnInit, OnDestroy {
  projects: Project[] = [];
  private unsubscribe: Subject<Project[]> = new Subject();

  constructor(private projectService: ProjectService, private notificationService: NotificationService) {
  }

  ngOnInit() {
    this.getProjects();
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

  enroll(project: Project) {
    console.log("Adding member: " + localStorage.getItem("loggedInUserEmail") + " to project: " + project.title);
    this.projectService.addMemberToProject(localStorage.getItem("loggedInUserEmail"), project).subscribe(
        (response: any) => {
          console.log(response);
          this.notificationService.sendNotification(project.owner.email, "Enrollment request",
              "User " + localStorage.getItem("loggedInUserEmail") + " wants to join your project").subscribe(
              (response: any) => {
                console.log(response);
                location.reload();
              },
              (error: any) => {
                console.log(error);
              });
        });
  }

  listMembers(project: Project) {
    let listOfMembers = [];
    project.members.filter(member => member.approved).forEach(member => listOfMembers.push(member.user.firstName + " " + member.user.lastName));
    return listOfMembers;
  }

  alreadyEnrolled(project: Project) {
    return project.members.filter(member => member.user.email === localStorage.getItem("loggedInUserEmail")).pop() !== undefined;
  }

  isUserLoggedIn(): boolean {
    return JSON.parse(localStorage.getItem("loggedIn"));
  }
}
