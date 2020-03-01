import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {User} from "../interfaces/user.model";
import {Messages} from "../shared/Messages";
import {Router} from "@angular/router";
import {ToastService} from "../shared/toast.service";
import {ShirtSize} from "../interfaces/shirt-size";
import {DataService} from "../shared/data.service";
import {Project} from "../interfaces/project.model";

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
  interval;

  constructor(private http: HttpClient, private  router: Router, private toastService: ToastService, public data: DataService) {
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
    clearInterval(this.interval);
    return this.http.post(this.LOGOUT_URL, {}, {responseType: 'text'});
  }

  register(form: any) {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        responseType: 'json'
      })
    };
    console.log("Sending data:");
    console.log(form.value);
    return this.http.post(this.REGISTER_URL, JSON.stringify(form.value), httpOptions);
  }

  updateInfo(form: any, user: User) {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        responseType: 'json'
      })
    };
    return this.http.put(this.USERS_URL + "/" + user.id, JSON.stringify(form.value), httpOptions);
  }

  getByEmail(email: string) {
    return this.http.get<User>(this.USER_BY_USERNAME_URL + email + "/", {responseType: 'json'});
  }

  userHasAdminRole(user: User) {
    if (JSON.parse(sessionStorage.getItem("loggedIn")) === false || JSON.parse(sessionStorage.getItem("loggedIn")) === null || user == null) {
      return false;
    } else {
      return user.roles.map(role => role.name).filter(name => name === "ROLE_ADMIN").pop() !== undefined;
    }
  }

  redirectAfterLogin(response: any, form) {
    console.log(response);
    sessionStorage.setItem("loggedIn", 'true');
    this.toastService.showTemporarySuccessMessage(Messages.logInSuccess).then(() => {
      this.getCurrentUser().subscribe((user: User) => {
        this.data.changeCurrentUser(user);
        this.router.navigateByUrl("home").then(() => {
          form.reset();
          this.interval = setInterval(() => {
            this.getCurrentUser().subscribe((user: User) => {
              this.data.changeCurrentUser(user);
            }, () => {
              this.data.changeCurrentUser(null);
            })
          }, 300000); // 300000 ms = 5 min
        });
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

  giveAdminRights(user: User) {
    return this.http.patch(this.USERS_URL + "/" + user.id + "?giveAdmin=" + true, {}, {responseType: "json"})
  }

  revokeAdminRights(user: User) {
    return this.http.patch(this.USERS_URL + "/" + user.id + "?giveAdmin=" + false, {}, {responseType: "json"})
  }

  isValuePresentInUserFields(user, value) {
    return user.email.toLowerCase().indexOf(value.toLowerCase()) > -1 || user.firstName.toLowerCase().indexOf(value.toLowerCase()) > -1
        || user.lastName.toLowerCase().indexOf(value.toLowerCase()) > -1;
  }
}
