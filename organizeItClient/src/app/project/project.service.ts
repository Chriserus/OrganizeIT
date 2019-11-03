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
  readonly MEMBERSHIP_URL = '/memberships';

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
      'owner': owner,
      'maxMembers': form.value.maxMembers
    };
    console.log(jsonData);
    // TODO: Secure this endpoint (or change something, that only get is allowed
    return this.http.post(this.PROJECTS_URL, jsonData, httpOptions);
  }

  deleteProject(project: Project){
    return this.http.delete(this.PROJECTS_URL + "/" + project.id);
  }

  addMemberToProject(member: User, project: Project) {
    return this.http.post<Project>(this.PROJECTS_URL + "/" + project.id + this.MEMBERSHIP_URL + "/" + member.id, {}, {responseType: 'json'});
  }

  approveMemberToProject(member: User, project: Project) {
    return this.http.put<Project>(this.PROJECTS_URL + "/" + project.id + this.MEMBERSHIP_URL + "/" + member.id, {}, {responseType: 'json'});
  }

  deleteMemberFromProject(member: User, project: Project) {
    return this.http.delete<Project>(this.PROJECTS_URL + "/" + project.id + this.MEMBERSHIP_URL + "/" + member.id, {responseType: 'json'});
  }
}
