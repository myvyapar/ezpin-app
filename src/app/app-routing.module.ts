import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthGuard } from './modules/shared/services/guard/auth.guard';
import { LoginGuard } from './modules/shared/services/guard/login.guard';
import { PermissionResolverService } from './modules/shared/services/resolver/permission-resolver.service';

const routes: Routes = [
  {
    path: '',
    loadChildren: () =>
      import('./modules/user-action/user-action.module').then(
        (m) => m.UserActionModule
      ),
    canActivate: [LoginGuard],
  },
  {
    path: 'panel',
    loadChildren: () =>
      import('./modules/user-panel/user-panel.module').then(
        (m) => m.UserPanelModule
      ),
    canActivate: [AuthGuard],
    resolve: [PermissionResolverService],
  },
  {
    path: '**',
    redirectTo: '',
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
