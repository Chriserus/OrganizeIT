import {Component, OnInit} from '@angular/core';
import {Project} from '../../interfaces/project.model';
import {ProjectService} from "../project.service";
import {Router} from "@angular/router";
import {AuthService} from "../../authentication/auth.service";

@Component({
  selector: 'app-submission',
  templateUrl: './submission.page.html',
  styleUrls: ['./submission.page.scss'],
})
export class SubmissionPage implements OnInit {

  project: Project;

  constructor(private projectService: ProjectService, private authService: AuthService, private  router: Router) {
  }

  ngOnInit() {
  }

  registerProject(form) {
    this.authService.getCurrentUser().subscribe(
        (response: any) => {
          this.projectService.addProject(form, response).subscribe(
              (response: any) => {
                console.log(response);
                this.router.navigateByUrl("home");
              })
        });
  }
}
