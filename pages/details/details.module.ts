import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DetailsComponent } from './details.component';
import { RouterModule, Routes } from '@angular/router';
import { DetailsRoutingModule } from './details-routing.module';

const routes: Routes = [{
  path: '',
  component: DetailsComponent,
}];

@NgModule({
  declarations: [
    DetailsComponent
  ],
  imports: [
    CommonModule,
    DetailsRoutingModule,
    RouterModule.forChild(routes),
  ]
})
export class DetailsModule { }
