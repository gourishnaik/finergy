import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HeaderComponent } from './@theme/components/header/header.component';
import { RouterModule } from '@angular/router';
import { LoaderComponent } from './@theme/components/loader/loader.component';
import { SlickCarouselModule } from 'ngx-slick-carousel';
import { InrcurrencyPipe } from './pages/details/goals/inrcurrency.pipe';

@NgModule({
    imports: [
        CommonModule, RouterModule, SlickCarouselModule
    ],
    declarations: [HeaderComponent, LoaderComponent, InrcurrencyPipe],
    exports: [
        HeaderComponent,
        LoaderComponent,
        SlickCarouselModule,
        InrcurrencyPipe
    ]
})
export class SharedModule { }
