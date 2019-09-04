import {Component, OnInit} from '@angular/core';
import {Router} from '@angular/router';
import {AuthService} from '../auth.service';
import {ToastService} from "../../shared/toast.service";
import {SubmitService} from "../../shared/submit.service";

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage extends SubmitService implements OnInit {
  //TODO: Messages properties
  private loggingInSuccessMessage = "Logged in successfully!";
  private loggingInErrorMessage = "Login failed, wrong user credentials";

  constructor(private authService: AuthService, private router: Router, private toastService: ToastService) {
    super();
  }

  ngOnInit() {
  }

  login(form) {
    if (!this.isButtonDisabled('submitButton')) {
      this.authService.login(form.value).subscribe(
          (response: any) => {
            console.log(response);
            localStorage.setItem("loggedIn", "true");
            this.toastService.showTemporarySuccessMessage(this.loggingInSuccessMessage).then(() => {
              this.router.navigateByUrl("home").then(() => {
                window.location.reload();
              });
            });
          },
          (error: any) => {
            console.log(error);
            this.toastService.showTemporaryErrorMessage(this.loggingInErrorMessage);
          });
    }
  }
}
