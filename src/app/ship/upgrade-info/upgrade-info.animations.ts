import { trigger, state, style, transition, animate, keyframes, query, stagger } from '@angular/animations';

/**
 * Styles
 */
const hidden = style({opacity: 0, transform: 'scale(0.9)'});
const show = style({opacity: 1, transform: 'scale(1)'});

/**
 * Animations
 */
export const enter = trigger('enter', [
    transition(':enter', [hidden, animate('0.2s 300ms cubic-bezier(.82,.01,.67,.99)', show)]),
    transition(':leave', [show, animate('0.2s cubic-bezier(.82,.01,.67,.99)', hidden)])
]);
