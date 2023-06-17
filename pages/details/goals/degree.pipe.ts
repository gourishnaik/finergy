import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'degree'
})
export class DegreePipe implements PipeTransform {

  transform(value: unknown): string {
    let deg: string = "doctor" //default doctor;
    switch (value) {
      case "doctor": {
        deg = "Doctor";
        break;
      }
      case "engineer": {
        deg = "Engineer";
        break;
      }
      case "mba": {
        deg = "MBA";
        break;
      }
      case "architect": {
        deg = "Architect";
        break;
      }
      case "ca": {
        deg = "CA";
        break;
      }
      default: {
        deg = "";
        break;
      }
    }
    return deg;
  }
}
