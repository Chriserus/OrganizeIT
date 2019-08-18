import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {Project} from '../interfaces/project.model';

@Injectable({
  providedIn: 'root'
})
export class ProjectService {
  readonly PROJECTS_URL = '/api/projects';

  constructor(private http: HttpClient) {
  }

  getProjects(): Observable<Project[]> {
    return this.http.get<Project[]>(this.PROJECTS_URL, {responseType: 'json'});
    // TODO do some error handling
  }
}
