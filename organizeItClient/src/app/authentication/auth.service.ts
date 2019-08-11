import {Injectable} from '@angular/core';
import {Observable} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor() {
  }

  login(form): Observable<string> {
    // TODO: Implement login functionality frontend
    return null;
  }

  logout(): Observable<string>{
    // TODO: Implement logout functionality frontend
    return null;
  }

  register(form): Observable<string> {
    // TODO: Implement register functionality frontend
    return null;
  }
}
