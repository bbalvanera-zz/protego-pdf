import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'ellipsis'
})
export class EllipsisPipe implements PipeTransform {

  public transform(value: string = '', length: number = 50): string {
    let retVal = value;

    if (value.length > length) {
      retVal = `${value.substr(0, 47)}...`;
    }

    return retVal;
  }
}
