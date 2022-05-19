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
    this.model = this.picdoc;
  }

  form = new FormGroup({});
  model = {};
  // {
  //   goesTo: [{}], // <== somehow not hooked up here
  // };
  options: FormlyFormOptions = {};

  fields: FormlyFieldConfig[] = [
    {
      key: 'goesTo',
      type: 'repeat',
      templateOptions: { // props moved inside templateOptions sometime in version 6 evolution ...
        props: {
          addText: 'Add Item',
          label: 'Items in this picture',
        }
      },
      fieldArray: {
        fieldGroup: [
          { key: 'desc',
            type: 'input',
            templateOptions: {
            // props: {
              label: 'X',
              placeholder: 'Item name',
              required: true,
            },
          },
          { key: 'to',
            type: 'input',
            templateOptions: {
            // props: {
              label: 'TO',
              placeholder: 'person name',
              required: false,
            },
          },
          { key: 'per',
            type: 'input',
            templateOptions: {
            // props: {
              label: 'SAYS',
              placeholder: 'person name',
              required: false,
            },
          },

        ]
      }
    }
  ];

  submit() {
    // this is where we update the itemseen for this picdoc
    alert(JSON.stringify(this.model));
  }
}

