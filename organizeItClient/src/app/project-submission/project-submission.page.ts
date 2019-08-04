import {Component, OnInit} from '@angular/core';
import {Project} from '../interfaces/project.model';

@Component({
  selector: 'app-project-submission',
  templateUrl: './project-submission.page.html',
  styleUrls: ['./project-submission.page.scss'],
})
export class ProjectSubmissionPage implements OnInit {

  project: Project;

  constructor() {
  }

  ngOnInit() {
  }

  registerProject(form) {
    // TODO: Implement project registering service
  }
}
