import {Component, OnInit} from '@angular/core';
import {Router} from '@angular/router';
import {AuthService} from '../auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {

  constructor(private  authService: AuthService, private  router: Router) {
  }

  ngOnInit() {
  }

  login(form) {
    this.authService.login(form.value).subscribe(
        (response: any) => {
          console.log(response)
          localStorage.setItem("loggedIn", "true");
          this.router.navigateByUrl("home").then(() => {
            window.location.reload();
          });
        },
        (error: any) => {
          console.log(error)
        });
  }

}
