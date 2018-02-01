import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'timer'
})
export class TimerPipe implements PipeTransform {

  transform(value: any, args?: any): any {
    const d = Math.floor(value / (1000 * 60 * 60 * 24));
    const h = Math.floor((value % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const m = Math.floor((value % (1000 * 60 * 60)) / (1000 * 60));
    const s = Math.floor((value % (1000 * 60)) / 1000);
    return `${!!d ? d + 'd ' : ''} ${!!h ? h + 'h ' : ''} ${!!m ? m + 'm ' : ''} ${!!s ? s + 's ' : ''}`;
  }

}
