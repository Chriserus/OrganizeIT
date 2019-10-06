import {Component, OnDestroy, OnInit} from '@angular/core';
import {takeUntil} from "rxjs/operators";
import {ProjectService} from "../project/project.service";
import {Project} from "../interfaces/project.model";
import {Subject} from "rxjs";
import {ProjectUser} from "../interfaces/project-user";

@Component({
  selector: 'app-profile',
  templateUrl: './profile.page.html',
  styleUrls: ['./profile.page.scss'],
})
export class ProfilePage implements OnInit, OnDestroy {
  projects: Project[] = [];
  private unsubscribe: Subject<Project[]> = new Subject();

  constructor(public projectService: ProjectService) {
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
    this.projectService.getProjectsByOwnerOrMemberEmail(localStorage.getItem("loggedInUserEmail")).pipe(takeUntil(this.unsubscribe)).subscribe(projects => {
      console.log(projects);
      this.projects = projects;
    });
  }

  listMembers(project: Project) {
    return project.members.filter(member => member.approved).map(member => member.user.firstName + " " + member.user.lastName);
  }

  listPotentialMembers(project: Project){
    return project.members.filter(member => !member.approved);
  }

  acceptUserToProject(project: Project, potentialMember: ProjectUser) {
    // TODO: Call backend method that changes approved to true on selected project
  }

  rejectUser(project: Project, potentialMember: ProjectUser) {
    // TODO: Call backend method that deletes user connection with that project
  }
}
