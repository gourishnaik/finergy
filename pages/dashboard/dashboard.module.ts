import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DashboardComponent } from './dashboard.component';
import { Routes, RouterModule } from '@angular/router';
import { SharedModule } from 'src/app/shared.modules';
import { ReactiveFormsModule } from '@angular/forms';

const routes: Routes = [{
  path: '',
  component: DashboardComponent,
}];


@NgModule({
  declarations: [
    DashboardComponent
  ],
  imports: [
    CommonModule,
    SharedModule,
    RouterModule.forChild(routes),
    ReactiveFormsModule,
    
  ]
})
export class DashboardModule { }
