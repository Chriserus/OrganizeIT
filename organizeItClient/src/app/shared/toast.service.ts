import {Injectable} from '@angular/core';
import {ToastController} from "@ionic/angular";

@Injectable({
  providedIn: 'root'
})
export class ToastService {
  private errorToastDuration = 2000;
  private informationToastDuration = 5000;

  constructor(private toastController: ToastController) {
  }

  async showTemporaryErrorMessage(message: string) {
    const toast = await this.toastController.create({
      message: message,
      duration: this.errorToastDuration,
      color: "danger",
    });
    await toast.present();
  }

  async showTemporarySuccessMessage(message: string) {
    const toast = await this.toastController.create({
      message: message,
      duration: this.errorToastDuration,
      color: "success",
    });
    await toast.present();
  }

  async showClosableInformationMessage(message: string){
    const toast = await this.toastController.create({
      color: 'secondary',
      message: message,
      duration: this.informationToastDuration,
      showCloseButton: true
    });
    await toast.present();
  }
}
