import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { WealthManagementComponent } from './wealth-management.component';
import { Routes, RouterModule } from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from 'src/app/shared.modules';
const routes: Routes = [{
  path: '',
  component: WealthManagementComponent,
}];


@NgModule({
  declarations: [
    WealthManagementComponent
  ],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    ReactiveFormsModule,
    SharedModule
  ]
})
export class WealthManagementModule { }
