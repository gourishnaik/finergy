import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'inrcurrency'
})
export class InrcurrencyPipe implements PipeTransform {

  transform(val: any) {
    console.log(val)
    return new Intl.NumberFormat('en-IN', {

      currency: 'INR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(Number(val));

  }

}
