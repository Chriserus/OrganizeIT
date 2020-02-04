import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {Project} from '../interfaces/project.model';
import {User} from "../interfaces/user.model";

@Injectable({
  providedIn: 'root'
})
export class ProjectService {
  readonly PROJECTS_URL = '/api/projects';
  readonly USERS_URL = '/api/users';

  constructor(private http: HttpClient) {
  }

  getProjects() {
    return this.http.get<Project[]>(this.PROJECTS_URL, {responseType: 'json'});
  }

  getProjectsByOwnerOrMember(user: User) {
    return this.http.get<Project[]>(this.USERS_URL + "/" + user.id + "/projects", {responseType: 'json'});
  }

  addProject(form: any, owner: User) {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        responseType: 'json'
      })
    };
    let jsonData = {
      'title': form.value.title,
      'description': form.value.description,
      'technologies': form.value.technologies,
      'owner': owner,
      'maxMembers': form.value.maxMembers
    };
    console.log(jsonData);
    // TODO: Secure this endpoint (or change something, that only get is allowed)
    return this.http.post(this.PROJECTS_URL + "?joinProject=" + form.value.joinAsMember, jsonData, httpOptions);
  }

  deleteProject(project: Project) {
    return this.http.delete(this.PROJECTS_URL + "/" + project.id);
  }

  verifyProject(project: Project) {
    return this.http.put<Project>(this.PROJECTS_URL + "/" + project.id, {}, {responseType: 'json'});
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
  }

  countApprovedMembers(project: Project) {
    return project.members.filter(member => member.approved).length;
  }

  listApprovedMembers(project: Project) {
    return project.members.filter(member => member.approved).map(member => member.user);
  }
}
