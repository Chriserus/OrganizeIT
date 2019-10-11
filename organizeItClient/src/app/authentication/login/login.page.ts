import {Component, OnInit} from '@angular/core';
import {Router} from '@angular/router';
import {AuthService} from '../auth.service';
import {ToastService} from "../../shared/toast.service";
import {SubmitService} from "../../shared/submit.service";
import {Messages} from "../../shared/Messages";

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage extends SubmitService implements OnInit {

  constructor(private authService: AuthService, private router: Router, private toastService: ToastService) {
    super();
  }

  ngOnInit() {
  }

  login(form) {
    if (this.isButtonDisabled('submitButton')) {
      return;
    }
    this.authService.login(form.value.email, form.value.password).subscribe(
        (response: any) => {
          console.log(response);
          localStorage.setItem("loggedIn", 'true');
          this.toastService.showTemporarySuccessMessage(Messages.logInSuccess).then(() => {
            this.router.navigateByUrl("home").then(() => {
              window.location.reload();
            });
          });
        },
        (error: any) => {
          console.log(error);
          if (error.status === 404) {
            this.toastService.showTemporaryErrorMessage(Messages.wrongCredentials);
          } else if (error.status === 504) {
            this.toastService.showTemporaryErrorMessage(Messages.serverUnavailable);
          }
        });
  }
}
