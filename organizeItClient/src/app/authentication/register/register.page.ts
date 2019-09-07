import {Component, OnInit} from '@angular/core';
import {Router} from '@angular/router';
import {AuthService} from '../auth.service';
import {ToastService} from "../../shared/toast.service";
import {SubmitService} from "../../shared/submit.service";
import {Messages} from "../../shared/Messages";

@Component({
  selector: 'app-register',
  templateUrl: './register.page.html',
  styleUrls: ['./register.page.scss'],
})
export class RegisterPage extends SubmitService implements OnInit {

  constructor(private authService: AuthService, private  router: Router, private toastService: ToastService) {
    super();
  }

  ngOnInit() {
  }

  register(form) {
    if (!this.isButtonDisabled('submitButton')) {
      if (form.value.password != form.value.passwordConfirm) {
        this.toastService.showTemporaryErrorMessage(Messages.passwordMismatch);
        console.log(Messages.passwordMismatch);
        return;
      }
      this.authService.getByEmail(form.value.email).subscribe(data => {
            console.log(data);
            if (data === null) {
              console.log("Registering user with email: " + form.value.email);
              this.authService.register(form.value).subscribe(
                  (response: any) => {
                    console.log(response);
                    this.router.navigateByUrl("home").then(() => {
                      this.toastService.showTemporarySuccessMessage(Messages.registerSuccess)
                    });
                  },
                  (error: any) => {
                    this.toastService.showTemporaryErrorMessage(Messages.registerFailure)
                  });
            } else if (data.email === form.value.email) {
              this.toastService.showTemporaryErrorMessage(Messages.emailExists);
              console.log(Messages.emailExists)
            }
          },
          error => {
            this.toastService.showTemporaryErrorMessage(Messages.serverUnavailable)
          });
    }
  }
}
