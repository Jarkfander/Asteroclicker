import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
// Components
import { NgSliderComponent, NgSlideComponent } from './ng-slider/ng-slider.component';
import { NgTooltipComponent } from './tooltip/ng-tooltip.component';
import { ModalComponent } from './modal/modal.component';
import { NgProgressComponent } from './ng-progress/ng-progress.component';

// Directive 
import { TooltipDirective } from './tooltip/tooltip.directive';

// pipe
import { TimerPipe } from './timer.pipe';

// Services 
import { NotifyService } from './notify/notify.service';

@NgModule({
  imports: [
    CommonModule
  ],
  declarations: [
    ModalComponent,
    NgSlideComponent,
    NgSliderComponent,
    NgProgressComponent,
    NgTooltipComponent,
    TooltipDirective,
    TimerPipe
  ],
  exports: [
    ModalComponent,
    NgSlideComponent,
    NgSliderComponent,
    NgProgressComponent,
    TooltipDirective,
    TimerPipe
  ],
  providers: [NotifyService],
  entryComponents: [NgTooltipComponent]
})

export class SharedModule {

  // 1000000 => 1 000 000
  static calculeMoneyWithSpace(num: number) {
    const temp = ((Math.round(num * 100) / 100).toFixed(2)).toString();
    let newCredit = '';
    let boolVirgule = true;
    let tempi = 0;
    for (let j = 0; j < (temp.length - 3) % 3; j++) {
      newCredit = newCredit + temp[j];
      tempi = j + 1;
    }
    if (tempi > 0 && num > 100) {
      newCredit = newCredit + ' ';
    }

    for (let i = tempi; i < temp.length; i++) {
      if (temp[i + 1] === '.') {
        boolVirgule = false;
      }
      newCredit = newCredit + temp[i];
      if (((i + 1) - tempi) % 3 === 0 && i !== temp.length - 1 && boolVirgule) {
        newCredit = newCredit + ' ';
      }
    }
    if (newCredit[newCredit.length - 1] === '0' &&  newCredit[newCredit.length - 2] === '0') {
      newCredit = newCredit.substr(0, newCredit.length - 3);
    }
    return newCredit;
  }
}
