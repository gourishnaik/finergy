import { Component, OnInit, AfterViewInit, HostListener } from '@angular/core';
import { NgxMaskModule, IConfig } from 'ngx-mask'
import { LoaderService } from './@core/broadcaster/loader.service';


const maskConfig: Partial<IConfig> = {
  validation: false,
};

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'finergy_web';

  constructor(private pageLoader: LoaderService) {
    this.pageLoader.pageLoader.emit({ showLoader: true });
  }

}
