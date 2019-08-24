import {Injectable} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {NavController} from "@ionic/angular";
import {User} from "../interfaces/user.model";

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  readonly LOGIN_URL = '/api/login';
  readonly REGISTER_URL = '/api/register';
  readonly LOGOUT_URL = '/api/logout';
  readonly LOGGED_IN_USER_URL = '/api/email';
  readonly USER_BY_USERNAME_URL = '/api/users/emails/';

  constructor(private http: HttpClient, public navCtrl: NavController) {
  }

  getCurrentUser() {
    return this.http.get(this.LOGGED_IN_USER_URL, {responseType: 'text'});
  }

  login(form: any) {
    let formData: FormData = new FormData();
    formData.append('email', form.email);
    formData.append('password', form.password);
    return this.http.post(this.LOGIN_URL, formData, {responseType: 'text'});
  }


  logout() {
    this.http.post(this.LOGOUT_URL, {}, {responseType: 'text'}).subscribe();
  }

  register(form: any) {
    let formData: FormData = new FormData();
    formData.append('email', form.email);
    formData.append('password', form.password);
    formData.append('passwordConfirm', form.passwordConfirm);
    return this.http.post(this.REGISTER_URL, formData, {responseType: 'text'});
  }

  getByUsername(email: string) {
    return this.http.get<User>(this.USER_BY_USERNAME_URL + email + "/", {responseType: 'json'});
  }
}
