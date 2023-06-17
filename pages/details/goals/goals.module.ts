import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GoalsComponent } from './goals.component';
import { SharedPagesModule } from '../../shared-pages.module';
import { Routes, RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { DegreePipe } from './degree.pipe';
import { NgxMaskModule } from 'ngx-mask';
import { GetYearsPipe } from './get-years.pipe';
import { SharedModule } from 'src/app/shared.modules';
//import { InrcurrencyPipe } from './inrcurrency.pipe';

const routes: Routes = [{
  path: '',
  component: GoalsComponent,
}];

@NgModule({
  declarations: [
    GoalsComponent,
    DegreePipe,
    GetYearsPipe,
    //InrcurrencyPipe,
  ],
  imports: [
    CommonModule,
    SharedPagesModule,
    FormsModule,
    RouterModule.forChild(routes),
    ReactiveFormsModule,
    SharedModule,
    NgxMaskModule.forRoot()
  ]
})
export class GoalsModule { }
