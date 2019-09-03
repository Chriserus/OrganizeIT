import {Component, OnInit} from '@angular/core';
import {Router} from '@angular/router';
import {AuthService} from '../auth.service';
import {ToastController} from "@ionic/angular";

@Component({
  selector: 'app-register',
  templateUrl: './register.page.html',
  styleUrls: ['./register.page.scss'],
})
export class RegisterPage implements OnInit {
  private errorToastDuration = 2000;

  constructor(private authService: AuthService, private  router: Router, private toastController: ToastController) {
  }

  ngOnInit() {
  }

  register(form) {
    if (form.value.password != form.value.passwordConfirm) {
      this.showTemporaryErrorMessage("Your password and confirmation password do not match.");
      console.log("Your password and confirmation password do not match.");
      return;
    }
    this.authService.getByEmail(form.value.email).subscribe(data => {
      console.log(data);
      if (data === null) {
        console.log("Registering user with email: " + form.value.email);
        this.authService.register(form.value).subscribe(
            (response: any) => {
              console.log(response);
              this.router.navigateByUrl("home");
            },
            (error: any) => {
              console.log(error)
            });
      } else if (data.email === form.value.email) {
        this.showTemporaryErrorMessage("Email already exists in database!");
        console.log("Email already exists in database!")
      }
    });
  }

  async showTemporaryErrorMessage(message: string) {
    const toast = await this.toastController.create({
      message: message,
      duration: this.errorToastDuration,
      color: "danger",
    });
    await toast.present();
  }
}
