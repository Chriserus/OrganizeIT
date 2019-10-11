import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {Project} from '../interfaces/project.model';
import {User} from "../interfaces/user.model";

@Injectable({
  providedIn: 'root'
})
export class ProjectService {
  readonly PROJECTS_URL = '/api/projects';
  readonly PROJECT_MEMBERSHIP_URL = '/api/projects/membership/';

  constructor(private http: HttpClient) {
  }

  getProjects() {
    return this.http.get<Project[]>(this.PROJECTS_URL, {responseType: 'json'});
  }

  getProjectsByOwnerOrMemberEmail(email: string) {
    return this.http.get<Project[]>(this.PROJECTS_URL + "/" + email + "/", {responseType: 'json'});
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

  addMemberToProject(memberEmail: string, project: Project) {
    let memberAdditionUrl = this.PROJECT_MEMBERSHIP_URL + project.id + "/" + memberEmail + "/";
    console.log("Url: " + memberAdditionUrl);
    return this.http.post<Project>(memberAdditionUrl, {}, {responseType: 'json'});
  }

  approveMemberToProject(memberEmail: string, project: Project) {
    let memberApprovalUrl = this.PROJECT_MEMBERSHIP_URL + project.id + "/" + memberEmail + "/";
    console.log("Url: " + memberApprovalUrl);
    return this.http.put<Project>(memberApprovalUrl, {}, {responseType: 'json'});
  }

  deleteMemberFromProject(memberEmail: string, project: Project) {
    let memberDeletionUrl = this.PROJECT_MEMBERSHIP_URL + project.id + "/" + memberEmail + "/";
    console.log("Url: " + memberDeletionUrl);
    return this.http.delete<Project>(memberDeletionUrl, {responseType: 'json'});
  }
}
