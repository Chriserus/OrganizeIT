import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {Banner} from "../interfaces/banner";

@Injectable({
    providedIn: 'root'
})
export class BannerService {
    readonly BANNER_URL = '/api/banner';
    readonly BANNERS_URL = '/api/banners';

    constructor(private http: HttpClient) {
    }

    getBanner(id: number) {
        return this.http.get(this.BANNER_URL + "/" + id, {responseType: 'arraybuffer'})
    }

    getActiveBanner() {
        return this.http.get<Banner>(this.BANNER_URL);
    }

    setActiveBanner(id: number) {
        const httpOptions = {
            headers: new HttpHeaders({
                'Content-Type': 'application/json',
                responseType: 'application/json'
            })
        };
        return this.http.post(this.BANNER_URL + "/" + id, {}, httpOptions)
    }

    getAllBanners() {
        return this.http.get<Banner[]>(this.BANNERS_URL);
    }

    addBanner(file: Blob, fileName: string) {
        const formData = new FormData();
        formData.append("file", file);
        formData.append("name", fileName);
        return this.http.post(this.BANNER_URL, formData);
    }

    deleteBanner(id: number) {
        return this.http.delete(this.BANNER_URL + "/" + id, {})
    }
}