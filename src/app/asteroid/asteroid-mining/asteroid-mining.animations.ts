import { trigger, transition, group, query, style, animate } from '@angular/animations';

export const mining = trigger('mining', [
    transition(':increment', group([
      query(':enter', [
        style({ color: 'green', fontSize: '50%' }),
        animate('0.8s ease-out', style('*'))
      ])
    ])),
    transition(':decrement', group([
      query(':enter', [
        style({ color: 'red', fontSize: '50%' }),
        animate('0.8s ease-out', style('*'))
      ])
    ]))
  ]);
