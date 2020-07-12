import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {ProjectCardComponent} from "./project-card/project-card.component";
import {IonicModule} from "@ionic/angular";


@NgModule({
    declarations: [ProjectCardComponent],
    exports: [
        ProjectCardComponent
    ],
    imports: [
        CommonModule,
        IonicModule
    ]
})
export class ComponentsModule {
}
