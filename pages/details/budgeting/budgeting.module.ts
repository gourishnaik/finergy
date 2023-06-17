import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BudgetingComponent } from './budgeting.component';
import { Routes, RouterModule } from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from 'src/app/shared.modules';
import { InrcurrencyPipe } from '../goals/inrcurrency.pipe';
const routes: Routes = [{
  path: '',
  component: BudgetingComponent,
}];

@NgModule({
  declarations: [
    BudgetingComponent
  ],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    ReactiveFormsModule,
    SharedModule
  ]
})
export class BudgetingModule { }
