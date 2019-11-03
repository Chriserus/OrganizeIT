import {NgModule} from '@angular/core';
import {PreloadAllModules, RouterModule, Routes} from '@angular/router';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'home',
    pathMatch: 'full'
  },
  {
    path: 'home',
    loadChildren: './home/home.module#HomePageModule'
  },
  {
    path: 'list',
    loadChildren: './list/list.module#ListPageModule'
  },
  {
    path: 'submission',
    loadChildren: './project/submission/submission.module#SubmissionPageModule'
  },
  {path: 'agenda', loadChildren: './agenda/agenda.module#AgendaPageModule'},
  {path: 'board', loadChildren: './comment/board/board.module#BoardPageModule'},
  {path: 'archive', loadChildren: './archive/archive.module#ArchivePageModule'},
  {path: 'register', loadChildren: './authentication/register/register.module#RegisterPageModule'},
  {path: 'login', loadChildren: './authentication/login/login.module#LoginPageModule'},
  {path: 'profile', loadChildren: './profile/profile.module#ProfilePageModule'},
  {path: 'admin', loadChildren: './admin/admin.module#AdminPageModule'}
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, {preloadingStrategy: PreloadAllModules})
  ],
  exports: [RouterModule]
})
export class AppRoutingModule {
}
