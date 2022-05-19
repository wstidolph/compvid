import { Component, Input } from '@angular/core';

import { BaseComponent } from '@compvid/xplat/core';
import { PicDoc, PicdocService, PlacesService } from '@compvid/xplat/features';
import { FormGroup } from '@angular/forms';
import { FormlyFormOptions, FormlyFieldConfig } from '@ngx-formly/core';

// ionic

@Component({
  selector: 'compvid-dpinfo',
  templateUrl: 'dpinfo.component.html',
  styles: ['wayne-name { color: red;}']
})
export class DpinfoComponent extends BaseComponent {
  @Input() picdoc!: PicDoc;

  form = new FormGroup({});
  model: PicDoc = this.picdoc;
  options: FormlyFormOptions = {
    formState: {
      disabled: false,
    },
  };
  fields: FormlyFieldConfig[] = [
    {
      key: 'name',
      type: 'input',
      templateOptions: {
        label: 'Name'
      },
      className: 'wayne-name'
    },
    {
      key: 'location',
      type: 'select',
      templateOptions: {
        label: 'Where',
        options: this.placesService.getPlaceDocs()

      }
    },
    {
      key: 'desc',
      type: 'input',
      templateOptions: {
        label: 'Desc',
      },
      expressionProperties: {
        // apply expressionProperty for disabled based on formState
        'templateOptions.disabled': 'formState.disabled',
      },
    },
  ];

  constructor(private picDocService: PicdocService, private placesService: PlacesService) {
    super();
  }
  ngOnInit() {
    this.model = this.picdoc;
  }

  submit() {
    console.log('submit model', this.model)
    this.picDocService.updatePicDoc(this.model);
  }
}
