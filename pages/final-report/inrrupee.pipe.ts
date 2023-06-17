import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'inrrupee'
})
export class InrrupeePipe implements PipeTransform {


  transform(val: any) {
    console.log(val)
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(Number(val));

  }

}

