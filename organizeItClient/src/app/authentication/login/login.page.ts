import {Component, OnInit} from '@angular/core';
import {Router} from '@angular/router';
import {AuthService} from '../auth.service';
import {ToastService} from "../../shared/toast.service";
import {SubmitService} from "../../shared/submit.service";
import {Messages} from "../../shared/Messages";

@Component({
    selector: 'app-login',
    templateUrl: './login.page.html',
    styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {

    constructor(private authService: AuthService, private router: Router, private toastService: ToastService,
                private submitService: SubmitService) {
    }

    ngOnInit() {
    }

    login(form) {
        if (this.submitService.isButtonDisabled('submitButton')) {
            return;
        }
        this.authService.login(form.value.email, form.value.password).subscribe(
            (response: any) => {
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
