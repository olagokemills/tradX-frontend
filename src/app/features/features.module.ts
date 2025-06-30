import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { PagesComponent } from './pages/pages.component';
import { SharedModule } from '../shared/shared.module';
import { DashboardGuard } from '../core/guards/dashboard.guard';

const routes: Routes = [
  {
    path: 'auth',
    loadChildren: () => import('./auth/auth.module').then((m) => m.AuthModule),
  },
  {
    path: '',
    component: PagesComponent,
    loadChildren: () =>
      import('./pages/pages.module').then((m) => m.PagesModule),
    canActivate: [DashboardGuard],
  },
];

@NgModule({
  declarations: [PagesComponent],
  imports: [CommonModule, SharedModule, RouterModule.forChild(routes)],
})
export class FeaturesModule {}
