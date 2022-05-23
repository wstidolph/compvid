import { Directive, OnDestroy, OnInit } from '@angular/core';
import { BaseComponent } from '@compvid/xplat/core';
// import { Subscription } from 'rxjs';
import { PlaceOptionsService } from '../services';

@Directive({
  selector: 'compvid-base-dummy'
})
export class PicdocformBaseComponent extends BaseComponent /* implements OnInit, OnDestroy */  {
  public text = 'Picdocform';

  // subs: Subscription[] = [];

  constructor(public poService: PlaceOptionsService) {
    super();
  }

  // ngOnInit(): void {

  // }

  // ngOnDestroy() {
  //   this.subs.forEach((sub) => sub.unsubscribe());
  // }

  formSubmit() {
    console.log('form submitted');
  }

}
