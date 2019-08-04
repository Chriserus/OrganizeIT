import {Component, OnInit} from '@angular/core';
import {Project} from '../../interfaces/project.model';

@Component({
  selector: 'app-submission',
  templateUrl: './submission.page.html',
  styleUrls: ['./submission.page.scss'],
})
export class SubmissionPage implements OnInit {

  project: Project;

  constructor() {
  }

  ngOnInit() {
  }

  registerProject(form) {
    // TODO: Implement project registering service
  }
}
