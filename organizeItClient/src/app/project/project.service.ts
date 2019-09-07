import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {Project} from '../interfaces/project.model';
import {User} from "../interfaces/user.model";

@Injectable({
  providedIn: 'root'
})
export class ProjectService {
  readonly PROJECTS_URL = '/api/projects';

  constructor(private http: HttpClient) {
  }

  getProjects() {
    return this.http.get<Project[]>(this.PROJECTS_URL, {responseType: 'json'});
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
    return this.http.post(this.PROJECTS_URL, jsonData, httpOptions);
  }
}
