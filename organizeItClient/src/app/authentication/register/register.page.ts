import {Component, OnInit} from '@angular/core';
import {Router} from '@angular/router';
import {AuthService} from '../auth.service';
import {ToastService} from "../../shared/toast.service";
import {SubmitService} from "../../shared/submit.service";

@Component({
  selector: 'app-register',
  templateUrl: './register.page.html',
  styleUrls: ['./register.page.scss'],
})
export class RegisterPage extends SubmitService implements OnInit {
  //TODO: Introduce messages properties
  private passwordMismatchMessage = "Your password and confirmation password do not match.";
  private emailExistsMessage = "Email already exists in database!";
  private registerSuccessMessage = "Registered successfully!";

  constructor(private authService: AuthService, private  router: Router, private toastService: ToastService) {
    super();
  }

  ngOnInit() {
  }

  register(form) {
    if(!this.isButtonDisabled('submitButton')) {
      if (form.value.password != form.value.passwordConfirm) {
        this.toastService.showTemporaryErrorMessage(this.passwordMismatchMessage);
        console.log(this.passwordMismatchMessage);
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
                  this.toastService.showTemporarySuccessMessage(this.registerSuccessMessage)
                });
              },
              (error: any) => {
                console.log(error)
              });
        } else if (data.email === form.value.email) {
          this.toastService.showTemporaryErrorMessage(this.emailExistsMessage);
          console.log(this.emailExistsMessage)
        }
      });
    }
  }
}
