import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { ClickOutsideModule } from 'ng-click-outside';

@NgModule({
  imports: [
    CommonModule,
    RouterModule,
    ClickOutsideModule
    
  ],
  exports: [
    RouterModule,
    ClickOutsideModule,
    
  ]

})
export class SharedPagesModule {

}
