import { Component, Input, OnInit } from '@angular/core';

import { BaseComponent } from '@compvid/xplat/core';
import { PicDoc, ItemSeen, ItemseenService } from '@compvid/xplat/features';
import { FormGroup } from '@angular/forms';
import { FormlyFormOptions, FormlyFieldConfig, FormlyField, FieldArrayType } from '@ngx-formly/core';
import { Observable, of } from 'rxjs';

//ionic

@Component({
  selector: 'compvid-dpitemseen',
  templateUrl: 'dpitemseen.component.html',
})
export class DpitemseenComponent extends BaseComponent implements OnInit   {
  @Input() picdoc!: PicDoc;

  items$: Observable<ItemSeen[]>;
  constructor(private itemseenservice: ItemseenService) {
    super();
    this.items$ = of([]);
  }

  ngOnInit() {
    const pdid = this.picdoc?.id ? this.picdoc.id : '';
    this.items$ = this.itemseenservice.getItemSeensByPicdoc(pdid)
  }

  form = new FormGroup({});
  model: any = {
    items: [null],
  };
  options: FormlyFormOptions = {};

  fields: FormlyFieldConfig[] = [
    {
      key: 'items',
      type: 'repeat',
      templateOptions: { // props moved inside templateOptions sometime in version 6 evolution ...
        props: {
          addText: 'Add Item',
          label: 'Items in this picture',
        }
      },
      fieldArray: {
        type: 'input',
        templateOptions: {
        // props: {
          placeholder: 'Item name',
          required: true,
        },
      },
    },
  ];

  submit() {
    alert(JSON.stringify(this.model));
  }
}

