import {Component, OnDestroy, OnInit} from '@angular/core';
import {ProjectService} from '../project/project.service';
import {Project} from '../interfaces/project.model';
import {Comment} from '../interfaces/comment.model';
import {Subject} from 'rxjs';
import {finalize, takeUntil} from 'rxjs/operators';
import {DataService} from "../shared/data.service";
import {CommentService} from "../comment/comment.service";

@Component({
    selector: 'app-home',
    templateUrl: 'home.page.html',
    styleUrls: ['home.page.scss'],
})
export class HomePage implements OnInit, OnDestroy {
    projects: Project[] = [];
    unsubscribe: Subject<Project[]> = new Subject();
    showProjectsSpinner: boolean;
    announcements: Comment[] = [];
    slideOptsOne = {
        initialSlide: 0,
        slidesPerView: 1,
        speed: 2500,
        autoplay: {
            disableOnInteraction: false,
        }
    };

    constructor(public projectService: ProjectService, public commentService: CommentService, private data: DataService) {
        this.getProjects();
        this.getAnnouncements();
        this.data.currentProjects.subscribe(projects => {
            this.projects = projects.filter(project => project.verified);
        });
        this.data.currentComments.subscribe(comments => this.announcements = comments.filter(comment => comment.announcement));
    }

    ngOnInit() {
        this.data.currentProjects.subscribe(projects => {
            this.projects = projects.filter(project => project.verified);
        });
        this.data.currentComments.subscribe(comments => this.announcements = comments.filter(comment => comment.announcement));
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
                //TODO: Filter projects on backend, make an endpoint that uses clustered index
                this.data.changeProjects(projects);
            });
    }

    getAnnouncements() {
        this.commentService.getComments().pipe(takeUntil(this.unsubscribe))
            .subscribe(comments => {
                //TODO: Filter comments on backend, make an endpoint that uses clustered index
                this.data.changeComments(comments);
            });
    }
}
