import {Injectable} from '@angular/core';

@Injectable({
    providedIn: 'root'
})
export class SubmitService {

    constructor() {
    }

    isButtonDisabled(id: string) {
        return (document.getElementById(id) as HTMLButtonElement).disabled;
    }
}
