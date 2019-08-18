import {Injectable} from '@angular/core';
import {Observable} from 'rxjs';
import {HttpClient} from "@angular/common/http";
import {NavController} from "@ionic/angular";

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  readonly LOGIN_URL = '/api/login';
  readonly LOGOUT_URL = '/api/logout';

  constructor(private http: HttpClient, public navCtrl: NavController) {
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
