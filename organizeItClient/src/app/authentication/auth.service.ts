import {Injectable} from '@angular/core';
import {Observable} from 'rxjs';
import {HttpClient} from "@angular/common/http";

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  readonly LOGIN_URL = '/api/login';

  constructor(private http: HttpClient) {
  }

  login(form: any): Observable<any> {
    let formData: FormData = new FormData();
    formData.append('username', form.email);
    formData.append('password', form.password);
    return this.http.post(this.LOGIN_URL, formData);
  }


  logout(): Observable<string> {
    // TODO: Implement logout functionality frontend
    return null;
  }

  register(form): Observable<string> {
    // TODO: Implement register functionality frontend
    return null;
  }
}
