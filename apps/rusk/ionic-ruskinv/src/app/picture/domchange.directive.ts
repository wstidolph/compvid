import { Directive, ElementRef, EventEmitter, NgZone, OnDestroy, Output } from '@angular/core';


@Directive({
  selector: '[domChange]',
})
export class DomchangeDirective implements OnDestroy {

  private changes: MutationObserver;

  private element;

  @Output()
  public domChange: EventEmitter<MutationRecord> = new EventEmitter<MutationRecord>();

  constructor(private elementRef: ElementRef) {

    this.element = this.elementRef.nativeElement;

    this.changes = new MutationObserver((mutations: MutationRecord[]) => {
      mutations.forEach((mutation:MutationRecord) => this.domChange.emit(mutation));
    })

    this.changes.observe(this.element, {
      attributes: true,
      attributeOldValue: true,
      childList: true,
      // characterData: true,
    })
  }

  ngOnDestroy(): void {
    this.changes.disconnect();
  }
}
