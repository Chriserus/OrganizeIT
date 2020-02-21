import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {Project} from '../interfaces/project.model';
import {User} from "../interfaces/user.model";
import {DataService} from "../shared/data.service";

@Injectable({
  providedIn: 'root'
})
export class ProjectService {
  readonly PROJECTS_URL = '/api/projects';
  readonly USERS_URL = '/api/users';
  private loggedInUser: User;

  constructor(private http: HttpClient, private data: DataService) {
    this.data.currentUser.subscribe(user => this.loggedInUser = user);
  }

  getProjects() {
    return this.http.get<Project[]>(this.PROJECTS_URL, {responseType: 'json'});
  }

  getProjectsByOwnerOrMember(user: User) {
    return this.http.get<Project[]>(this.USERS_URL + "/" + user.id + "/projects", {responseType: 'json'});
  }

  addProject(form: any) {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        responseType: 'json'
      })
    };
    // TODO: Secure this endpoint (or change something, that only get is allowed)
    return this.http.post(this.PROJECTS_URL + "?joinProject=" + form.value.joinAsMember, JSON.stringify(form.value), httpOptions);
  }

  deleteProject(project: Project) {
    return this.http.delete(this.PROJECTS_URL + "/" + project.id);
  }

  verifyProject(project: Project) {
    return this.http.put<Project>(this.PROJECTS_URL + "/" + project.id + "?verifyProject=" + true, {}, {responseType: 'json'});
  }

  invalidateProject(project: Project) {
    return this.http.put<Project>(this.PROJECTS_URL + "/" + project.id + "?verifyProject=" + false, {}, {responseType: 'json'});
  }

  confirmProject(project: Project) {
    return this.http.patch<Project>(this.PROJECTS_URL + "/" + project.id + "?confirmProject=" + true, {}, {responseType: 'json'});
  }

  unconfirmProject(project: Project) {
    return this.http.patch<Project>(this.PROJECTS_URL + "/" + project.id + "?confirmProject=" + false, {}, {responseType: 'json'});
  }

  modifyProject(project: Project) {
    return this.http.put<Project>(this.PROJECTS_URL, project);
  }

  modifyProjectOnDataChange(project: Project, data: any) {
    if (project.title != data.title) {
      project.title = data.title;
    }
    if (project.description != data.description) {
      project.description = data.description;
    }
    if (project.technologies != data.technologies) {
      project.technologies = data.technologies;
    }
    if (project.maxMembers != data.maxMembers) {
      project.maxMembers = data.maxMembers;
    }
  }

  countApprovedMembers(project: Project) {
    return project.members.filter(member => member.approved).length;
  }

  listApprovedMembers(project: Project) {
    return project.members.filter(member => member.approved).map(member => member.user);
  }

  listOwners(project: Project) {
    return project.owners.map(owner => owner.user);
  }

  userIsProjectOwner(user: User, project: Project) {
    return project.owners.map(owner => owner.user).filter(owner => owner.email === user.email).length == 0;
  }

  updateProjects() {
    this.getProjectsByOwnerOrMember(this.loggedInUser).subscribe((projects: Project[]) => {
      this.data.changeUserProjects(projects);
    });
    this.getProjects().subscribe((projects: Project[]) => {
      this.data.changeProjects(projects);
    });
  }

  maxMembersCapacityReached(project: Project) {
    return project.maxMembers === this.countApprovedMembers(project);
  }
}
