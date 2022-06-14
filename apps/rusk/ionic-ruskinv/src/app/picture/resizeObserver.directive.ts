import { Directive, ElementRef, EventEmitter, NgZone, OnDestroy, Output, Renderer2 } from '@angular/core';


@Directive({
  selector: '[resized]',
})
export class ResizeObserverDirective implements OnDestroy {

  private resizeObservable: ResizeObserver;

  resizeRect;

  private element;

  @Output()
  public resized: EventEmitter<any> = new EventEmitter();

  constructor(private elementRef: ElementRef,
              private zone: NgZone) {
    this.element = this.elementRef.nativeElement// .shadowRoot;
  }

  ngOnInit() {
    this.resizeObservable = new ResizeObserver(entries => {
      this.zone.run( () => {
        this.resizeRect  = entries[0].contentRect;
        this.resized.emit(this.resizeRect);
      })
    })

    this.resizeObservable.observe(this.element)
  }

  ngOnDestroy(): void {
    this.resizeObservable.disconnect();
  }
}
