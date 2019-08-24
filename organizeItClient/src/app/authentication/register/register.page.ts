import {Component, OnInit} from '@angular/core';
import {Router} from '@angular/router';
import {AuthService} from '../auth.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.page.html',
  styleUrls: ['./register.page.scss'],
})
export class RegisterPage implements OnInit {

  constructor(private  authService: AuthService, private  router: Router) {
  }

  ngOnInit() {
  }

  register(form) {
    //TODO: Pass Observable and in subscribe I will have synchronized calls
    if (form.value.password != form.value.passwordConfirm) {
      console.log('Password do not Match'); //TODO: Inform user about it
      return;
    }
    this.authService.getByEmail(form.value.email).subscribe(data => {
      console.log(data);
      if (data === null) {
        console.log("Registering user with email: " + form.value.email); //TODO: Inform user about it
        this.authService.register(form.value).subscribe(
            (response: any) => {
              console.log(response)
              this.router.navigateByUrl("home");
            },
            (error: any) => {
              console.log(error)
            });
      } else if (data.email === form.value.email) {
        console.log("Email already exists in database!") //TODO: Inform user about it
      }
    });
  }
}
