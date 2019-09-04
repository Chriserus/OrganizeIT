import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {NavController} from "@ionic/angular";
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

  constructor(private http: HttpClient) {
  }

  getCurrentUser() {
    return this.http.get(this.LOGGED_IN_USER_URL, {responseType: 'json'});
  }

  login(form: any) {
    let formData: FormData = new FormData();
    formData.append('email', form.email);
    formData.append('password', form.password);
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

  getByEmail(email: string) {
    return this.http.get<User>(this.USER_BY_USERNAME_URL + email + "/", {responseType: 'json'});
  }
}
