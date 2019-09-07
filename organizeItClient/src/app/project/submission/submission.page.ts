import {Component, OnInit} from '@angular/core';
import {Project} from '../../interfaces/project.model';
import {ProjectService} from "../project.service";
import {Router} from "@angular/router";
import {AuthService} from "../../authentication/auth.service";
import {SubmitService} from "../../shared/submit.service";

@Component({
  selector: 'app-submission',
  templateUrl: './submission.page.html',
  styleUrls: ['./submission.page.scss'],
})
export class SubmissionPage extends SubmitService implements OnInit {

  project: Project;

  constructor(private projectService: ProjectService, private authService: AuthService, private  router: Router) {
    super();
  }

  ngOnInit() {
  }

  registerProject(form) {
    if (!this.isButtonDisabled('submitButton')) {
      this.authService.getCurrentUser().subscribe(
          (response: any) => {
            this.projectService.addProject(form, response).subscribe(
                (response: any) => {
                  console.log(response);
                  form.reset();
                  this.router.navigateByUrl("home");
                })
          });
    }
  }
}
