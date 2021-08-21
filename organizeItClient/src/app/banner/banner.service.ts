import {Injectable} from '@angular/core';
import {HttpClient} from "@angular/common/http";

@Injectable({
    providedIn: 'root'
})
export class BannerService {
    readonly BANNER_URL = '/api/banner';

    constructor(private http: HttpClient) {
    }

    getActiveBanner() {
        return this.http.get(this.BANNER_URL);
    }

    addBanner(file: Blob, fileName: string) {
        const formData = new FormData();
        formData.append("file", file);
        formData.append("name", fileName);
        return this.http.post(this.BANNER_URL, formData);
    }
}