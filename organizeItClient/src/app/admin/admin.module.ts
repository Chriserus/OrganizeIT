import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule} from '@angular/forms';
import {RouterModule, Routes} from '@angular/router';

import {IonicModule} from '@ionic/angular';

import {AdminPage} from './admin.page';
import {ComponentsModule} from "../shared/components/components.module";

const routes: Routes = [
    {
        path: '',
        component: AdminPage
    }
];

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        IonicModule,
        RouterModule.forChild(routes),
        ComponentsModule
    ],
    declarations: [AdminPage]
})
export class AdminPageModule {
}
