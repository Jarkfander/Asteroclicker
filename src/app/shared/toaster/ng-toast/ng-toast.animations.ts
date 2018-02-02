import { bounceIn, bounceOut, easeOutQuad, easeInQuad } from './../../animations';
import { transition, animate, style, trigger } from "@angular/animations";

export const enter = trigger('enter', [
    transition('* => in', [
        animate(`800ms ${easeOutQuad}`, bounceIn)
    ]),
    transition('* => out', [
        animate(`800ms ${easeOutQuad}`, bounceOut)
    ])
]);

