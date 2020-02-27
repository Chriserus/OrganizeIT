import {Component, OnDestroy, OnInit} from '@angular/core';
import {ProjectService} from '../project/project.service';
import {Project} from '../interfaces/project.model';
import {Subject} from 'rxjs';
import {finalize, takeUntil} from 'rxjs/operators';
import {DataService} from "../shared/data.service";

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
    speed: 1000,
    autoplay: {
      disableOnInteraction: false
    }
  };

  constructor(public projectService: ProjectService, private data: DataService) {
    this.getProjects();
    this.data.currentProjects.subscribe(projects => {
      this.projects = projects.filter(project => project.verified);
    });
  }

  ngOnInit() {
    this.data.currentProjects.subscribe(projects => {
      this.projects = projects.filter(project => project.verified);
    });
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
          this.data.changeProjects(projects);
        });
  }
}
