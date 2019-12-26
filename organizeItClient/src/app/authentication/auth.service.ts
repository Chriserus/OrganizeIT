import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {User} from "../interfaces/user.model";
import {Messages} from "../shared/Messages";
import {Router} from "@angular/router";
import {ToastService} from "../shared/toast.service";
import {Events} from "@ionic/angular";
import {ShirtSize} from "../interfaces/shirt-size";

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  readonly SHIRT_SIZES_URL = '/api/shirt-sizes';
  readonly LOGIN_URL = '/api/login';
  readonly REGISTER_URL = '/api/register';
  readonly LOGOUT_URL = '/api/logout';
  readonly USERS_URL = '/api/users';
  readonly LOGGED_IN_USER_URL = '/api/user';
  readonly USER_BY_USERNAME_URL = '/api/users/emails/';

  constructor(private http: HttpClient, private  router: Router, private toastService: ToastService, public events: Events) {
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
      'password': form.password,
      'shirtType': form.shirtType,
      'shirtSize': form.shirtSize
    };
    console.log("Sending data:");
    console.log(jsonData);
    return this.http.post(this.REGISTER_URL, jsonData, httpOptions);
  }

  updateInfo(form: any, user: User) {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        responseType: 'json'
      })
    };
    let jsonData = {
      'firstName': form.firstName,
      'lastName': form.lastName,
      'shirtSize': form.shirtSize,
      'shirtType': form.shirtType
    };
    return this.http.put(this.USERS_URL + "/" + user.id, jsonData, httpOptions);
  }

  getByEmail(email: string) {
    return this.http.get<User>(this.USER_BY_USERNAME_URL + email + "/", {responseType: 'json'});
  }

  userHasAdminRole(user: User) {
    if (JSON.parse(localStorage.getItem("loggedIn")) === false || JSON.parse(localStorage.getItem("loggedIn")) === null || user == null) {
      return false;
    } else {
      return user.roles.map(role => role.name).filter(name => name === "ROLE_ADMIN").pop() !== undefined;
    }
  }

  redirectAfterLogin(response: any, form) {
    console.log(response);
    localStorage.setItem("loggedIn", 'true');
    this.toastService.showTemporarySuccessMessage(Messages.logInSuccess).then(() => {
      this.events.publish('reloadSideMenuData');
      this.router.navigateByUrl("home").then(() => {
        form.reset();
      });
    });
  }

  getAllShirtSizes() {
    return this.http.get<ShirtSize[]>(this.SHIRT_SIZES_URL, {responseType: 'json'})
  }

  getAllUsers() {
    return this.http.get<User[]>(this.USERS_URL, {responseType: "json"})
  }

  deleteUser(user: User) {
    return this.http.delete(this.USERS_URL + "/" + user.id)
  }
}
