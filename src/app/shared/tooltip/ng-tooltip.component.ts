import {Component, Input, AfterViewInit, ElementRef, ChangeDetectorRef} from '@angular/core';

interface Position {
    width: number;
    height: number;
    top: number;
    left: number;
}

@Component({
  selector: 'ng-tooltip',
  templateUrl: './ng-tooltip.component.html',
  styleUrls: ['./ng-tooltip.component.scss']
})
export class NgTooltipComponent implements AfterViewInit {

  // -------------------------------------------------------------------------
  // Inputs / Outputs
  // -------------------------------------------------------------------------
  @Input() hostElement: HTMLElement;

  @Input() content: string;

  @Input() placement: 'top'|'bottom'|'left'|'right' = 'bottom';

  @Input() animation = true;

  // -------------------------------------------------------------------------
  // Properties
  // -------------------------------------------------------------------------
  public top = -100000;
  public left = -100000;
  public isIn = false;

  // -------------------------------------------------------------------------
  // Constructor
  // -------------------------------------------------------------------------
  constructor(private element: ElementRef,
              private cdr: ChangeDetectorRef) {
  }

  // -------------------------------------------------------------------------
  // Lifecycle callbacks
  // -------------------------------------------------------------------------
  ngAfterViewInit(): void {
      this.show();
      this.cdr.detectChanges();
  }

  // -------------------------------------------------------------------------
  // Public Methods
  // -------------------------------------------------------------------------

  public show(): void {
      if (!this.hostElement) { return; }
      const p = this.positionElements(this.hostElement, this.element.nativeElement.children[0], this.placement);
      this.top = p.top;
      this.left = p.left;
      this.isIn = true;
  }

  public hide(): void {
      this.top = -100000;
      this.left = -100000;
      this.isIn = true;
  }

  // -------------------------------------------------------------------------
  // Private Methods
  // -------------------------------------------------------------------------
  private positionElements(hostEl: HTMLElement, targetEl: HTMLElement, positionStr: string, appendToBody: boolean = false): { top: number, left: number } {
      const positionStrParts = positionStr.split('-');
      const pos0 = positionStrParts[0];
      const pos1 = positionStrParts[1] || 'center';
      const hostElPos = appendToBody ? this.offset(hostEl) : this.position(hostEl);
      const targetElWidth = targetEl.offsetWidth;
      const targetElHeight = targetEl.offsetHeight;
      const shiftWidth: any = {
          center: function (): number {
              return hostElPos.left + hostElPos.width / 2 - targetElWidth / 2;
          },
          left: function (): number {
              return hostElPos.left;
          },
          right: function (): number {
              return hostElPos.left + hostElPos.width;
          }
      };

      const shiftHeight: any = {
          center: function (): number {
              return hostElPos.top + hostElPos.height / 2 - targetElHeight / 2;
          },
          top: function (): number {
              return hostElPos.top;
          },
          bottom: function (): number {
              return hostElPos.top + hostElPos.height;
          }
      };

      let targetElPos: { top: number, left: number };
      switch (pos0) {
            case 'right': {
                targetElPos = {
                    top: shiftHeight[pos1](),
                    left: shiftWidth[pos0]()
                };
                break;
            }
            case 'left': {
                targetElPos = {
                    top: shiftHeight[pos1](),
                    left: hostElPos.left - targetElWidth
                };
                break;
            }
            case 'bottom': {
                targetElPos = {
                    top: shiftHeight[pos0](),
                    left: shiftWidth[pos1]()
                };
                break;
            }
            default: {
                targetElPos = {
                    top: hostElPos.top - targetElHeight,
                    left: shiftWidth[pos1]()
                };
                break;
            }
        }

        return targetElPos;
  }

  private position(nativeEl: HTMLElement): Position {
      let offsetParentBCR = { top: 0, left: 0 };
      const elBCR = this.offset(nativeEl);
      const offsetParentEl = this.parentOffsetEl(nativeEl);
      // If parent is an Element (not a document)
      if (offsetParentEl !== window.document) {
          offsetParentBCR = this.offset(offsetParentEl);
          offsetParentBCR.top += offsetParentEl.clientTop - offsetParentEl.scrollTop;
          offsetParentBCR.left += offsetParentEl.clientLeft - offsetParentEl.scrollLeft;
      }

      const boundingClientRect = nativeEl.getBoundingClientRect();
      return {
          width: boundingClientRect.width || nativeEl.offsetWidth,
          height: boundingClientRect.height || nativeEl.offsetHeight,
          top: elBCR.top - offsetParentBCR.top,
          left: elBCR.left - offsetParentBCR.left
      };
  }

  private offset(nativeEl: any): Position {
      const boundingClientRect = nativeEl.getBoundingClientRect();
      return {
          width: boundingClientRect.width || nativeEl.offsetWidth,
          height: boundingClientRect.height || nativeEl.offsetHeight,
          top: boundingClientRect.top + (window.pageYOffset || window.document.documentElement.scrollTop),
          left: boundingClientRect.left + (window.pageXOffset || window.document.documentElement.scrollLeft)
      };
  }

    private getStyle(nativeEl: HTMLElement, cssProp: string): string {
        // IE
        if ((nativeEl as any).currentStyle) {
            return (nativeEl as any).currentStyle[cssProp];
        }
        if (window.getComputedStyle) {
            return (window.getComputedStyle(nativeEl) as any)[cssProp];
        }
        // finally try and get inline style
        return (nativeEl.style as any)[cssProp];
  }

  /**  */
  private isStaticPositioned(nativeEl: HTMLElement): boolean {
      return (this.getStyle(nativeEl, 'position') || 'static' ) === 'static';
  }

  /**  */
  private parentOffsetEl(nativeEl: HTMLElement): any {
      let offsetParent: any = nativeEl.offsetParent || window.document;
      while (offsetParent && offsetParent !== window.document && this.isStaticPositioned(offsetParent)) {
          offsetParent = offsetParent.offsetParent;
      }
      return offsetParent || window.document;
    }
}
