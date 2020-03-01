import {Component, OnInit} from '@angular/core';
import {Router} from '@angular/router';
import {AuthService} from '../auth.service';
import {ToastService} from "../../shared/toast.service";
import {SubmitService} from "../../shared/submit.service";
import {Messages} from "../../shared/Messages";
import {ShirtSize} from "../../interfaces/shirt-size";
import {ShirtType} from "../../interfaces/shirt-type.enum";
import {City} from "../../interfaces/city.enum";
import {Geolocation} from "@ionic-native/geolocation/ngx";

@Component({
  selector: 'app-register',
  templateUrl: './register.page.html',
  styleUrls: ['./register.page.scss'],
})
export class RegisterPage implements OnInit {
  readonly pozCoordinates = {latitude: 52.406376, longitude: 16.925167};
  readonly wroCoordinates = {latitude: 51.107883, longitude: 17.038538};
  shirtSizes: ShirtSize[];
  shirtTypes: ShirtType[] = [ShirtType.M, ShirtType.F];
  cities: City[] = [City.WRO, City.POZ];
  city: City;
  polishSpeaker = true;

  constructor(private authService: AuthService, private  router: Router, private toastService: ToastService,
              private geolocation: Geolocation, private submitService: SubmitService) {
  }

  ngOnInit() {
    this.authService.getAllShirtSizes().subscribe(shirtSizes => {
      this.shirtSizes = shirtSizes;
    });
  }

  register(form) {
    if (this.submitService.isButtonDisabled('submitButton')) {
      return;
    }
    if (form.value.password != form.value.passwordConfirm) {
      this.toastService.showTemporaryErrorMessage(Messages.passwordMismatch);
      return;
    }
    this.authService.getByEmail(form.value.email).subscribe(
        data => {
          if (data === null) {
            this.authService.register(form).subscribe(
                (response: any) => {
                  sessionStorage.setItem("loggedIn", 'true');
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
          }
        },
        () => {
          this.toastService.showTemporaryErrorMessage(Messages.serverUnavailable)
        });
  }

  checkUserLocation() {
    this.geolocation.getCurrentPosition().then((resp) => {
      let distanceToPoz = this.calculateDistanceBetweenCoordinates(resp.coords, this.pozCoordinates);
      let distanceToWro = this.calculateDistanceBetweenCoordinates(resp.coords, this.wroCoordinates);
      this.city = distanceToWro < distanceToPoz ? City.WRO : City.POZ
    }).catch((error) => {
      console.log('Error getting location', error);
    });
  }

  calculateDistanceBetweenCoordinates(origin, destination) {
    return Math.sqrt(Math.pow(origin.latitude - destination.latitude, 2) + Math.pow(origin.longitude - destination.longitude, 2))
  }
}
