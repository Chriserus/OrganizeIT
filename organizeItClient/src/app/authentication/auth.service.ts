import {Injectable} from '@angular/core';
import {Observable} from 'rxjs';
import {HttpClient} from "@angular/common/http";
import {NavController} from "@ionic/angular";
import {Project} from "../interfaces/project.model";

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  readonly LOGIN_URL = '/api/login';
  readonly LOGOUT_URL = '/api/logout';
  readonly LOGGED_IN_USER_URL = '/api/username';

  constructor(private http: HttpClient, public navCtrl: NavController) {
  }

  getUsername(): Observable<any>{
    return this.http.get(this.LOGGED_IN_USER_URL, {responseType: 'text'});
  }

  login(form: any): Observable<any> {
    let formData: FormData = new FormData();
    formData.append('username', form.email);
    formData.append('password', form.password);
    return this.http.post(this.LOGIN_URL, formData, {responseType: 'text'});
  }


  logout() {
    this.http.post(this.LOGOUT_URL, {}, {responseType: 'text'}).subscribe();
  }

  register(form): Observable<string> {
    // TODO: Implement register functionality frontend
    return null;
  }
}
