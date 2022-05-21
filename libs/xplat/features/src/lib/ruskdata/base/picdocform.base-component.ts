import { Directive } from '@angular/core';
import { BaseComponent } from '@compvid/xplat/core';
import { MY_FORM_MODEL } from "./my-dynamic-form.model";
import { DynamicFormModel, DynamicFormService } from "@ng-dynamic-forms/core";

@Directive({
  selector: 'compvid-base-dummy'
})
export class PicdocformBaseComponent extends BaseComponent {
  public text = 'Picdocform';
  formModel: DynamicFormModel = MY_FORM_MODEL;
  formGroup = this.formService.createFormGroup(this.formModel);

  constructor(private formService: DynamicFormService) {
    super();
  }
}
