import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'scoreColor'
})
export class ScoreColorPipe implements PipeTransform {

  transform(value: number): string {
    let color: string = "#26C352";  //#GREEN
    if (value <= 40) {
      color = "#FF0000"//#RED
    } else if (value >= 41 && value <= 69) {
      color = "#F9B101"//#ORANGE 
    }
    return color;
  }

}
