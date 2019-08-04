import {Component, OnDestroy, OnInit} from '@angular/core';
import {ProjectService} from '../project/project.service';
import {Project} from '../interfaces/project.model';
import {Subject} from 'rxjs';
import {takeUntil} from 'rxjs/operators';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage implements OnInit, OnDestroy {

  projects: Project[] = [];
  private unsubscribe: Subject<Project[]> = new Subject();

  constructor(public rest: ProjectService) {
  }

  ngOnInit() {
    this.getProjects();
  }

  ngOnDestroy(): void {
    this.unsubscribe.next();
    this.unsubscribe.complete();
  }

  getProjects() {
    this.projects = [];
    this.rest.getProjects().pipe(takeUntil(this.unsubscribe)).subscribe(projects => {
      console.log(projects);
      this.projects = projects;
    });
  }
}
