import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BasicInfoComponent } from './basic-info.component';
import { Routes, RouterModule } from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms';
import { NgxMaskModule } from 'ngx-mask';
import { SharedPagesModule } from '../../shared-pages.module';

const routes: Routes = [{
  path: '',
  component: BasicInfoComponent,
}];

@NgModule({
  declarations: [
    BasicInfoComponent
  ],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    ReactiveFormsModule,
    SharedPagesModule,
    NgxMaskModule.forRoot()
  ]
})
export class BasicInfoModule { }
