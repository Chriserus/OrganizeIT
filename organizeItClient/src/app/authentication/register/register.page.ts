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
    // this.usernameTaken(form.value.email).subscribe(x => {
    //
    // });

    //TODO: Pass Observable and in subscribe I will have synchronized calls

    if (form.value.password != form.value.passwordConfirm) {
      console.log('Password do not Match'); //TODO: Inform user about it
    } else if (this.emailTaken(form.value.email)) {
      console.log('Username already taken'); //TODO: Inform user about it
    } else {
      console.log(form.value);
      // this.authService.register(form.value).subscribe(
      //     (response: any) => {
      //       console.log(response)
      //       this.router.navigateByUrl("home");
      //     },
      //     (error: any) => {
      //       console.log(error)
      //     });
    }
  }

  emailTaken(email: string) {
    //TODO: Make this method so that if will wait for result
    let user = null;
    // await this.authService.getByUsername(username).subscribe(data => {
    //   user = data;
    //   console.log(data);
    // });
    console.log(user);
    return user;
  }
}
