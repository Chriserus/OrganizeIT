import {Injectable} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Comment} from "../interfaces/comment.model";

@Injectable({
    providedIn: 'root'
})
export class AnnouncementService {


    readonly ANNOUNCEMENTS_URL = '/api/announcements/';

    constructor(private http: HttpClient) {
    }

    getAnnouncements() {
        return this.http.get<Comment[]>(this.ANNOUNCEMENTS_URL, {responseType: 'json'});
    }

}
