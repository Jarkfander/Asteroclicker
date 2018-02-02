import { group, trigger, state, style, transition, animate, keyframes, query, stagger } from '@angular/animations';

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

export const staggerTile =  trigger('stagger-tile', [
    transition(':enter', [
        query('.tile', [hidden]),
        query('.tile', stagger('100ms', [
            animate('0.3s cubic-bezier(.82,.01,.67,.99)', show)
        ]))
    ]),
]);

export const figuesChange = trigger('figures-change', [
    transition(':increment', [
        style({ textShadow: '0 0 5px rgb(200, 200, 0)' }),
        animate('0.8s ease-out', style('*'))
    ]),
    transition(':decrement', [
        style({ textShadow: '0 0 5px rgb(200, 0, 0)' }),
        animate('0.8s ease-out', style('*'))
    ]),
]);

/**
 * KEYFRAMES
 */
// Enter
export const bounceIn = keyframes([
    style({ transform: 'scale3d(0.3, 0.3, 0.3)', offset: 0 }),
    style({ transform: 'scale3d(1.1, 1.1, 1.1)', offset: 0.2 }),
    style({ transform: 'scale3d(0.9, 0.9, 0.9)', offset: 0.4 }),
    style({ transform: 'scale3d(1.03, 1.03, 1.03)', offset: 0.6 }),
    style({ transform: 'scale3d(0.97, 0.97, 0.97)', offset: 0.8 }),
    style({ transform: 'scale3d(1, 1, 1)', offset: 1 })
]);

// Leave
export const bounceOut = keyframes([
    style({ transform: 'scale3d(1, 1, 1)', offset: 0 }),
    style({ transform: 'scale3d(0.9, 0.9, 0.9)', offset: 0.2 }),
    style({ transform: 'scale3d(1.1, 1.1, 1.1)', offset: 0.5 }),
    style({ transform: 'scale3d(1.1, 1.1, 1.1)', offset: 0.55 }),
    style({ transform: 'scale3d(0.3, 0.3, 0.3)', opacity: 0, offset: 1 })
]);


/**
 * Easing
 */
export const easeInSine = 'cubic-bezier(0.47, 0, 0.745, 0.715)';
export const easeOutSine = 'cubic-bezier(0.39, 0.575, 0.565, 1)';
export const easeInOutSine = 'cubic-bezier(0.445, 0.05, 0.55, 0.95)';

export const easeInQuad = 'cubic-bezier(0.55, 0.085, 0.68, 0.53)';
export const easeOutQuad = 'cubic-bezier(0.25, 0.46, 0.45, 0.94)';
export const easeInOutQuad = 'cubic-bezier(0.455, 0.03, 0.515, 0.955)';

export const easeInCubic = 'cubic-bezier(0.55, 0.055, 0.675, 0.19)';
export const easeOutCubic = 'cubic-bezier(0.215, 0.61, 0.355, 1)';
export const easeInOutCubic = 'cubic-bezier(0.645, 0.045, 0.355, 1)';

export const easeInQuart = 'cubic-bezier(0.895, 0.03, 0.685, 0.22)';
export const easeOutQuart = 'cubic-bezier(0.165, 0.84, 0.44, 1)';
export const easeInOutQuart = 'cubic-bezier(0.77, 0, 0.175, 1)';

export const easeInQuint = 'cubic-bezier(0.755, 0.05, 0.855, 0.06)';
export const easeOutQuint = 'cubic-bezier(0.23, 1, 0.32, 1)';
export const easeInOutQuint = 'cubic-bezier(0.86, 0, 0.07, 1)';

export const easeInExpo = 'cubic-bezier(0.95, 0.05, 0.795, 0.035)';
export const easeOutExpo = 'cubic-bezier(0.19, 1, 0.22, 1)';
export const easeInOutExpo = 'cubic-bezier(1, 0, 0, 1)';

export const easeInCirc = 'cubic-bezier(0.6, 0.04, 0.98, 0.335)';
export const easeOutCirc = 'cubic-bezier(0.075, 0.82, 0.165, 1)';
export const easeInOutCirc = 'cubic-bezier(0.785, 0.135, 0.15, 0.86)';

export const easeInBack = 'cubic-bezier(0.6, -0.28, 0.735, 0.045)';
export const easeOutBack = 'cubic-bezier(0.175, 0.885, 0.32, 1.275)';
export const easeInOutBack = 'cubic-bezier(0.68, -0.55, 0.265, 1.55)';

