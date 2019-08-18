import {Component, OnInit} from '@angular/core';
import {Router} from '@angular/router';
import {AuthService} from '../auth.service';
import {NavController} from "@ionic/angular";

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {

  constructor(private  authService: AuthService, private  navCtrl: NavController) {
  }

  ngOnInit() {
  }

  login(form) {
    this.authService.login(form.value).subscribe(
        (response: any) => {
          console.log(response)
          this.navCtrl.navigateForward("home");
        },
        (error: any) => {
          console.log(error)
    });
  }

}
