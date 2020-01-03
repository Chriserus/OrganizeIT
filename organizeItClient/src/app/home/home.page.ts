import {Component, OnDestroy, OnInit} from '@angular/core';
import {ProjectService} from '../project/project.service';
import {Project} from '../interfaces/project.model';
import {Subject} from 'rxjs';
import {finalize, takeUntil} from 'rxjs/operators';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage implements OnInit, OnDestroy {
  projects: Project[] = [];
  unsubscribe: Subject<Project[]> = new Subject();
  showProjectsSpinner: boolean;
  slideOptsOne = {
    initialSlide: 0,
    slidesPerView: 1,
    autoplay: {
      disableOnInteraction: false
    }
  };

  constructor(public projectService: ProjectService) {
  }

  ngOnInit() {
    this.getProjects();
  }

  isUserLoggedIn() {
    return JSON.parse(sessionStorage.getItem("loggedIn")) === true;
  }

  ngOnDestroy() {
    this.unsubscribe.next();
    this.unsubscribe.complete();
  }

  getProjects() {
    this.showProjectsSpinner = true;
    this.projectService.getProjects().pipe(takeUntil(this.unsubscribe))
        .pipe(finalize(async () => {
          this.showProjectsSpinner = false;
        }))
        .subscribe(projects => {
      console.log(projects);
      //TODO: Filter projects on backend, make an endpoint that uses clustered index
      this.projects = projects.filter(project => project.verified === true);
    });
  }
}
