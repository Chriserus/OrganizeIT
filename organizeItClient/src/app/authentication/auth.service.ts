import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {User} from "../interfaces/user.model";

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  readonly LOGIN_URL = '/api/login';
  readonly REGISTER_URL = '/api/register';
  readonly LOGOUT_URL = '/api/logout';
  readonly LOGGED_IN_USER_URL = '/api/user';
  readonly USER_BY_USERNAME_URL = '/api/users/emails/';
  readonly UPDATE_USER_INFO_URL = '/api/user/update/';

  constructor(private http: HttpClient) {
  }

  getCurrentUser() {
    return this.http.get(this.LOGGED_IN_USER_URL, {responseType: 'json'});
  }

  login(email: string, password: string) {
    let formData: FormData = new FormData();
    formData.append('email', email);
    formData.append('password', password);
    return this.http.post(this.LOGIN_URL, formData, {responseType: 'text'});
  }


  logout() {
    return this.http.post(this.LOGOUT_URL, {}, {responseType: 'text'});
  }

  register(form: any) {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        responseType: 'json'
      })
    };

    let jsonData = {
      'firstName': form.firstName,
      'lastName': form.lastName,
      'email': form.email,
      'password': form.password
    };
    return this.http.post(this.REGISTER_URL, jsonData, httpOptions);
  }

  updateInfo(form: any, email: string) {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        responseType: 'json'
      })
    };

    let jsonData = {
      'firstName': form.firstName,
      'lastName': form.lastName
    };
    return this.http.put(this.UPDATE_USER_INFO_URL + email + "/", jsonData, httpOptions);
  }

  getByEmail(email: string) {
    return this.http.get<User>(this.USER_BY_USERNAME_URL + email + "/", {responseType: 'json'});
  }
}
