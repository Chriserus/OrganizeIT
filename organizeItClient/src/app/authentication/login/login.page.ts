import {Component, OnInit} from '@angular/core';
import {Router} from '@angular/router';
import {AuthService} from '../auth.service';
import {ToastService} from "../../shared/toast.service";
import {SubmitService} from "../../shared/submit.service";
import {Messages} from "../../shared/Messages";
import {timer} from "rxjs";
import {AppComponent} from "../../app.component";

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {

  constructor(private authService: AuthService, private router: Router, private toastService: ToastService,
              private submitService: SubmitService, private appComponent: AppComponent) {
  }

  ngOnInit() {
  }

  login(form) {
    if (this.submitService.isButtonDisabled('submitButton')) {
      return;
    }
    this.authService.login(form.value.email, form.value.password).subscribe(
        (response: any) => {
          //TODO: Check correctness, for now after a timeout user is being logged out
          const source = timer(1800000); //1 800 000 ms = 30 min -> default spring security timeout
          const subscribe = source.subscribe(val => this.appComponent.logout());
          this.authService.redirectAfterLogin(response, form);
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
