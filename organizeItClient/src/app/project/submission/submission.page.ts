import {Component, OnInit} from '@angular/core';
import {ProjectService} from "../project.service";
import {Router} from "@angular/router";
import {AuthService} from "../../authentication/auth.service";
import {SubmitService} from "../../shared/submit.service";
import {ToastService} from "../../shared/toast.service";
import {Messages} from "../../shared/Messages";

@Component({
    selector: 'app-submission',
    templateUrl: './submission.page.html',
    styleUrls: ['./submission.page.scss'],
})
export class SubmissionPage implements OnInit {
    joinAsMember = true;

    constructor(private projectService: ProjectService, private authService: AuthService, private  router: Router,
                private toastService: ToastService, private submitService: SubmitService) {
    }

    ngOnInit() {
    }

    // TODO: Add notification sending to admins?
    registerProject(form) {
        if (!this.submitService.isButtonDisabled('submitButton')) {
            if (form.value.maxMembers === 0) {
                form.value.maxMembers = 1;
            }
            this.projectService.addProject(form).subscribe(
                () => {
                    form.reset();
                    this.toastService.showClosableInformationMessage(Messages.projectSubmittedMessage);
                    this.router.navigateByUrl("profile");
                })

        }
    }
}
