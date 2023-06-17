import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FinalReportComponent } from './final-report.component';
import { RouterModule, Routes } from '@angular/router';
import { ActionButtonPipe } from './action-button.pipe';
import { ScoreColorPipe } from './score-color.pipe';
import { SharedModule } from 'src/app/shared.modules';
import { InrrupeePipe } from './inrrupee.pipe';

const routes: Routes = [{
  path: '',
  component: FinalReportComponent,
}];

@NgModule({
  declarations: [
    FinalReportComponent,
    ActionButtonPipe,
    ScoreColorPipe,
    InrrupeePipe
  ],
  imports: [
    CommonModule,
    SharedModule,
    RouterModule.forChild(routes),
  ]
})
export class FinalReportModule { }
