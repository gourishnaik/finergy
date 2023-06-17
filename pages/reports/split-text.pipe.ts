import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'splitText'
})
export class SplitTextPipe implements PipeTransform {

  transform(value: String, index:number): String {

    return  value.split(',')[index].split(':')[1];
  }

}
