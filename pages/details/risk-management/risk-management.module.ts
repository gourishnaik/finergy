import { NgModule, NO_ERRORS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RiskManagementComponent } from './risk-management.component';
import { Routes, RouterModule } from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from 'src/app/shared.modules';

const routes: Routes = [{
  path: '',
  component: RiskManagementComponent,
}];

@NgModule({
  declarations: [
    RiskManagementComponent
  ],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    ReactiveFormsModule,
    SharedModule
  ],

})
export class RiskManagementModule { }
