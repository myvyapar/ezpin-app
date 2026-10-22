import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { PanelComponent } from './components/panel/panel.component';

const routes: Routes = [
  {
    path: '', component: PanelComponent,
    children: [
      { path: '', redirectTo: 'shop', pathMatch: 'full' },

      {
        path: 'shop', loadChildren: () =>
          import('./shop/shop.module').then(mod => mod.ShopModule)
      },
    ],
    // resolve: [ResolverService],
    // canActivate: [AuthGuard]
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class UserPanelRoutingModule { }
