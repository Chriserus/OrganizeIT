import {Injectable} from '@angular/core';
import {HttpClient} from "@angular/common/http";

@Injectable({
    providedIn: 'root'
})
export class EventService {
    readonly EVENT_URL = '/api/event';

    constructor(private http: HttpClient) {
    }

    exportEvent() {
        return this.http.get(this.EVENT_URL, {responseType: 'arraybuffer'});
    }
}
