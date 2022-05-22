import { Directive, OnDestroy, OnInit } from '@angular/core';
import { BaseComponent } from '@compvid/xplat/core';
import { MY_FORM_MODEL } from "./my-dynamic-form.model";
import { DynamicFormModel, DynamicFormService,
  DynamicSelectModel, DynamicFormOption } from "@ng-dynamic-forms/core";
import { of,map, tap, Subscription } from 'rxjs';
import { PlaceOptionsService } from '../services/placeoption.service';

@Directive({
  selector: 'compvid-base-dummy'
})
export class PicdocformBaseComponent extends BaseComponent implements OnInit, OnDestroy {
  public text = 'Picdocform';
  formModel: DynamicFormModel = MY_FORM_MODEL;
  formGroup = this.formService.createFormGroup(this.formModel);

  subs: Subscription[] = [];

  constructor(private formService: DynamicFormService, public poService: PlaceOptionsService) {
    super();
  }

  ngOnInit(): void {
    // this.subscribePlaceOptions()
  }

  ngOnDestroy() {
    this.subs.forEach((sub) => sub.unsubscribe());
  }

  formSub() {
    console.log('form submitted', this.formGroup.value)
  }

  private subscribePlaceOptions(){ // this is for the DynamicForms branch
    const locModel =
      this.formService.findModelById<DynamicSelectModel<string>>('pdLoc', this.formModel);

    const loc$ = this.poService.getPlaceOptions(); // will continue observing
    if (locModel != undefined) {
      const sub = loc$.pipe(
        map((x) => x.map(loc =>  new DynamicFormOption<string>(loc))),
        tap((wrapped) => locModel.options = wrapped),
        tap(() => this.formService.detectChanges())
      ).subscribe();
      this.subs.push(sub);
    } else {
      console.log('PicdocformBaseComponent subscribePlaceOptions no place options from service')
    }
  }
}
