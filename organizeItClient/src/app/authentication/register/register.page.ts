import {Component, OnInit} from '@angular/core';
import {Router} from '@angular/router';
import {AuthService} from '../auth.service';
import {ToastService} from "../../shared/toast.service";
import {SubmitService} from "../../shared/submit.service";
import {Messages} from "../../shared/Messages";
import {ShirtSize} from "../../interfaces/shirt-size";
import {ShirtType} from "../../interfaces/shirt-type.enum";

@Component({
  selector: 'app-register',
  templateUrl: './register.page.html',
  styleUrls: ['./register.page.scss'],
})
export class RegisterPage extends SubmitService implements OnInit {
  shirtSizes: ShirtSize[];
  shirtTypes: ShirtType[] = [ShirtType.M, ShirtType.F];

  constructor(private authService: AuthService, private  router: Router, private toastService: ToastService) {
    super();
  }

  ngOnInit() {
    this.authService.getAllShirtSizes().subscribe(data => {
      this.shirtSizes = data;
    });
  }

  register(form) {
    if (this.isButtonDisabled('submitButton')) {
      return;
    }
    if (form.value.password != form.value.passwordConfirm) {
      this.toastService.showTemporaryErrorMessage(Messages.passwordMismatch);
      console.log(Messages.passwordMismatch);
      return;
    }
    this.authService.getByEmail(form.value.email).subscribe(
        data => {
          console.log(data);
          if (data === null) {
            console.log("Registering user with email: " + form.value.email);
            console.log("Chosen size: " + form.value.shirtSize);
            console.log("Chosen type: " + form.value.shirtType);
            this.authService.register(form.value).subscribe(
                (response: any) => {
                  console.log(response);
                  localStorage.setItem("loggedIn", 'true');
                  this.router.navigateByUrl("home").then(() => {
                    this.toastService.showTemporarySuccessMessage(Messages.registerSuccess);
                    this.authService.login(form.value.email, form.value.password).subscribe((response: any) => {
                      this.authService.redirectAfterLogin(response, form);
                    })
                  });
                },
                () => {
                  this.toastService.showTemporaryErrorMessage(Messages.registerFailure)
                });
          } else if (data.email === form.value.email) {
            this.toastService.showTemporaryErrorMessage(Messages.emailExists);
            console.log(Messages.emailExists)
          }
        },
        () => {
          this.toastService.showTemporaryErrorMessage(Messages.serverUnavailable)
        });
  }

}
