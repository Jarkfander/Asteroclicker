import { Observable } from 'rxjs/Observable';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Subject } from 'rxjs/Subject';

import { tap, take } from 'rxjs/operators';
import { timer } from 'rxjs/observable/timer';

export enum ToastStates {
    in = 'in',
    out = 'out',
    click = 'click',
    hoverIn = 'hoverIn',
    hoverOut = 'hoverOut'
}

export interface IToastOptions {
    timer?: number;
    styles?: Partial<CSSStyleDeclaration>;
}

export interface IToast {
    id?: string;
    type?: string;
    title?: string;
    content?: string;
    state?: Observable<string>;
    onHover: Observable<boolean>;
    onClick: Observable<IToast>;
    onRemove: Observable<IToast>;
    hover: (isHover: boolean) => void;
    remove: () => void;
    click: () => void;
}

export class Toast implements IToast, IToastOptions {
    public id?: string;
    public type?: string;
    public title?: string;
    public content?: string;
    public timer? = 2000;
    public animOut? = 800;
    public styles?: Partial<CSSStyleDeclaration>;

    private stateSubject = new BehaviorSubject<ToastStates>(ToastStates.in);
    private hoverSubject = new BehaviorSubject<boolean>(false);
    private clickSubject = new Subject<IToast>();
    private removeSubject = new Subject<IToast>();

    constructor(type: string, title: string, content?: string, options?: IToastOptions) {
        this.id =  Math.random().toString(36).substring(3);
        this.type = type;
        this.title = title;
        this.content = content;
        if (options) {
            this.timer = options.timer ? options.timer : 2000;
            this.styles = options.styles;
        }
        this.stateSubject.next(ToastStates.in);
    }

    public get state(): Observable<ToastStates> {
        return this.stateSubject.asObservable();
    }

    public get onHover(): Observable<boolean> {
        return this.hoverSubject.asObservable();
    }

    public get onClick(): Observable<IToast> {
        return this.clickSubject.asObservable();
    }

    public get onRemove(): Observable<IToast> {
        return this.removeSubject.asObservable();
    }

    /** Change state on fire click */
    public hover(isHover: boolean) {
        this.stateSubject.next(ToastStates.hoverIn);
        this.hoverSubject.next(isHover);
    }

    /** Change state on fire click */
    public click() {
        this.stateSubject.next(ToastStates.click);
        this.clickSubject.next(this);
    }

    /** Change state and wait for animation to finish */
    public remove() {
        this.stateSubject.next(ToastStates.out);
        timer(this.animOut).pipe(take(1))
            .subscribe(() => this.removeSubject.next(this));
    }

}
