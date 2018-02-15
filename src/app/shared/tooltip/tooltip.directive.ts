import { NgTooltipComponent } from './ng-tooltip.component';
import {
  Directive, HostListener, ComponentRef, ViewContainerRef, Input, ComponentFactoryResolver,
  ComponentFactory
} from '@angular/core';

@Directive({
  selector: '[tooltip]'
})
export class TooltipDirective {

  // -------------------------------------------------------------------------
  // Properties
  // -------------------------------------------------------------------------
  private tooltip: ComponentRef<NgTooltipComponent>;
  private visible: boolean;

  // -------------------------------------------------------------------------
  // Constructor
  // -------------------------------------------------------------------------
  constructor(private viewContainerRef: ViewContainerRef,
              private resolver: ComponentFactoryResolver) {
  }

  // -------------------------------------------------------------------------
  // Inputs / Outputs
  // -------------------------------------------------------------------------
  @Input('tooltip') content: string| NgTooltipComponent;

  @Input()
  tooltipDisabled: boolean;

  @Input()
  tooltipPlacement: 'top'|'bottom'|'left'|'right' = 'bottom';

  // -------------------------------------------------------------------------
  // Public Methods
  // -------------------------------------------------------------------------
  @HostListener('focusin')
  @HostListener('mouseenter') show(): void {
      if (this.tooltipDisabled || this.visible) { return; }

      this.visible = true;
      // If string
      if (typeof this.content === 'string') {
          const factory = this.resolver.resolveComponentFactory(NgTooltipComponent);
          if (!this.visible) { return; }
          this.tooltip = this.viewContainerRef.createComponent(factory);
          this.tooltip.instance.hostElement = this.viewContainerRef.element.nativeElement;
          this.tooltip.instance.content = this.content as string;
          this.tooltip.instance.placement = this.tooltipPlacement;
      } else {
          const tooltip = this.content as NgTooltipComponent;
          tooltip.hostElement = this.viewContainerRef.element.nativeElement;
          tooltip.placement = this.tooltipPlacement;
          tooltip.show();
      }
  }

    @HostListener('focusout')
    @HostListener('mouseleave') hide(): void {
        if (!this.visible) { return; }

        this.visible = false;
        if (this.tooltip) { this.tooltip.destroy(); }

        if (this.content instanceof NgTooltipComponent) {
            (this.content as NgTooltipComponent).hide();
        }
  }

}
