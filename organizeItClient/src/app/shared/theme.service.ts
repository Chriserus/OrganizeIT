import {Injectable} from '@angular/core';
import {Platform} from "@ionic/angular";
import {Storage} from "@ionic/storage";
import {StatusBar} from "@ionic-native/status-bar/ngx";

const THEME_KEY = "selected-app-theme";

@Injectable({
    providedIn: 'root'
})
export class ThemeService {
    darkMode = false;

    constructor(private platform: Platform, private storage: Storage, private statusBar: StatusBar) {
        this.platform.ready().then(() => {
            this.storage.get(THEME_KEY).then(theme => {
                this.setAppTheme(theme);
            });
            const prefersDark = window.matchMedia("(prefers-color-scheme: dark)");
            this.setAppTheme(prefersDark.matches);
            prefersDark.addEventListener("change", e => {
                this.setAppTheme(e.matches);
            })
        })
    }

    setAppTheme(dark) {
        this.darkMode = dark;
        if (this.darkMode) {
            document.body.classList.add("dark");
        } else {
            document.body.classList.remove("dark");
        }
        this.storage.set(THEME_KEY, this.darkMode);

        if (this.darkMode) {
            this.statusBar.styleBlackOpaque();
            this.statusBar.backgroundColorByHexString("#000000");
        } else {
            this.statusBar.styleDefault();
            this.statusBar.backgroundColorByHexString("#ffffff");
        }
    }

    toggleAppTheme() {
        this.darkMode = !this.darkMode;
        this.setAppTheme(this.darkMode);
        return this.darkMode;
    }
}
