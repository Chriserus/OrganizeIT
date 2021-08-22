import {Component, OnDestroy, OnInit} from '@angular/core';
import {ProjectService} from '../project/project.service';
import {Project} from '../interfaces/project.model';
import {Comment} from '../interfaces/comment.model';
import {Subject} from 'rxjs';
import {finalize, takeUntil} from 'rxjs/operators';
import {DataService} from "../shared/data.service";
import {AnnouncementService} from "../comment/announcement.service";
import {BannerService} from "../banner/banner.service";
import {DomSanitizer} from '@angular/platform-browser';

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
    banner: any;
    slideOptsOne = {
        initialSlide: 0,
        slidesPerView: 1,
        speed: 2500,
        autoplay: {
            disableOnInteraction: false,
        }
    };

    constructor(public projectService: ProjectService, public announcementService: AnnouncementService,
                public bannerService: BannerService, private data: DataService, private sanitizer: DomSanitizer) {
        this.bannerService.getActiveBanner().subscribe(banner => {
            this.bannerService.getBanner(banner.id).subscribe(banner => {
                this.createImageFromBlob(banner);
                console.log(banner);
            })
        })
        this.getProjects();
        this.getAnnouncements();
        this.data.currentProjects.subscribe(projects => {
            this.projects = projects.filter(project => project.verified);
        });
        this.data.currentAnnouncements.subscribe(announcements => this.announcements = announcements);
    }

    createImageFromBlob(image: Blob) {
        let reader = new FileReader();
        reader.addEventListener("load", () => {
            this.banner = reader.result;
        }, false);

        if (image) {
            reader.readAsDataURL(image);
        }
    }

    ngOnInit() {
        this.data.currentProjects.subscribe(projects => {
            this.projects = projects.filter(project => project.verified);
        });
        this.data.currentAnnouncements.subscribe(announcements => this.announcements = announcements);
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
        this.announcementService.getAnnouncements().pipe(takeUntil(this.unsubscribe))
            .subscribe(announcements => this.data.changeAnnouncements(announcements));
    }
}
