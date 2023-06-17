import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReportsComponent } from './reports.component';
import { RouterModule, Routes } from '@angular/router';
import { ScoreColorPipe } from './score-color.pipe';
import { SectionCommentsComponent } from './section-comments/section-comments.component';
// import { MiniReportComponent } from './mini-report/mini-report.component';
import { SplitTextPipe } from './split-text.pipe';
import { SharedModule } from 'src/app/shared.modules';


const routes: Routes = [
  {
    path: '',
    component: ReportsComponent,
  }
];


@NgModule({
  declarations: [
    ReportsComponent,
    ScoreColorPipe,
    SectionCommentsComponent,
    SplitTextPipe,

  ],
  imports: [
    CommonModule,
    SharedModule,
    RouterModule.forChild(routes),
  ]
})
export class ReportsModule { }
