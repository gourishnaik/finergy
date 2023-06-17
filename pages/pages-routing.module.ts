import { RouterModule, Routes } from '@angular/router';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PagesComponent } from './pages.component';

const routes: Routes = [{
  path: '',
  component: PagesComponent,
  children: [

    {
      path: '',
      loadChildren: () => import('./dashboard/dashboard.module').then(m => m.DashboardModule),
      data: {
        preload: true,
        delay: true
      },
    },
    {
      path: 'auth/:id',
      loadChildren: () => import('./login/login.module').then(m => m.LoginModule),
      data: {
        preload: true,
        delay: true
      },
    },
    {
      path: 'details',
      loadChildren: () => import('./details/details.module').then(m => m.DetailsModule),
      data: {
        preload: true,
        delay: true
      },
    },
    {
      path: 'pre-report',
      loadChildren: () => import('./reports/reports.module').then(m => m.ReportsModule),
      data: {
        preload: true,
        delay: true,
      },
    },
    {
      path: 'report',
      loadChildren: () => import('./final-report/final-report.module').then(m => m.FinalReportModule),
      data: {
        preload: true,
        delay: true,
      },
    },
    {
      path: '',
      redirectTo: '',
      pathMatch: 'full',
    }
  ]
},];


@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    RouterModule.forChild(routes)
  ],
  exports: [RouterModule]
})
export class PagesRoutingModule { }
