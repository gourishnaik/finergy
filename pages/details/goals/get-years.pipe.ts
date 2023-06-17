import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'getYears'
})
export class GetYearsPipe implements PipeTransform {

  currentYear = new Date().getFullYear();

  transform(count: number, year: number =0): Array<number> {
    return new Array(count).fill(0)
    .map((n, index) => (this.currentYear+ year ) + index);
  }

}
