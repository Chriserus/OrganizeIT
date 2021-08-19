import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from "@angular/common/http";

@Injectable({
    providedIn: 'root'
})
export class EventService {
    readonly EVENT_URL = '/api/event';
    readonly EVENTS_URL = '/api/events';

    constructor(private http: HttpClient) {
    }

    exportEvent() {
        return this.http.get(this.EVENT_URL, {responseType: 'arraybuffer'});
    }

    archiveEvent(title: string) {
        const httpOptions = {
            headers: new HttpHeaders({
                'Content-Type': 'application/json',
                responseType: 'json'
            })
        };
        let jsonData = {
            'title': title,
            // TODO: Banner here
            'banner': "BANNER"
        };
        return this.http.post(this.EVENTS_URL, jsonData, httpOptions);
    }
}
