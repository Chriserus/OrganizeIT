import {Component, OnInit} from '@angular/core';
import {Project} from './project.model';

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

  addProject() {

  }

}
