import {Injectable} from '@angular/core';
import {ToastController} from "@ionic/angular";

@Injectable({
    providedIn: 'root'
})
export class ToastService {
    private temporaryToastDuration = 3000;
    private closableToastDuration = 10000;

    constructor(private toastController: ToastController) {
    }

    async showTemporaryWarningMessage(message: string) {
        const toast = await this.toastController.create({
            message: message,
            duration: this.temporaryToastDuration,
            color: "warning",
        });
        await toast.present();
    }

    async showTemporaryErrorMessage(message: string) {
        const toast = await this.toastController.create({
            message: message,
            duration: this.temporaryToastDuration,
            color: "danger",
        });
        await toast.present();
    }

    async showTemporarySuccessMessage(message: string) {
        const toast = await this.toastController.create({
            message: message,
            duration: this.temporaryToastDuration,
            color: "success",
        });
        await toast.present();
    }

    async showClosableInformationMessage(message: string) {
        const toast = await this.toastController.create({
            message: message,
            duration: this.closableToastDuration,
            color: 'secondary',
            buttons: [{
                text: 'Close',
                role: 'close'
            }]
        });
        await toast.present();
    }
}
