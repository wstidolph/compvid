import { Directive, Input, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormArray, FormGroup, Validators } from '@angular/forms';

import { BaseComponent } from '@compvid/xplat/core';
import { Observable, Subscription } from 'rxjs';
import { PicDoc } from '../models';
// import { Subscription } from 'rxjs';
import { PicdocService, PlaceOptionsService } from '../services';
import { GoesToService, GoesToOption } from '../services/goesto.service';

@Directive({
  selector: 'compvid-base-dummy'
})
export class PicdocformBaseComponent extends BaseComponent implements OnInit, OnDestroy  {
  public text = 'Picdocform';

  @Input()
  pd!: PicDoc;

  pdForm!: FormGroup;

  subs: Subscription[] = [];
  gtoptions$!: Observable<GoesToOption[]>;

  constructor(public picdocService: PicdocService,
              public poService: PlaceOptionsService,
              public goesToService: GoesToService,
              public fb: FormBuilder ) {
      super();
  }

  ngOnInit(): void {
    this.gtoptions$ = this.goesToService.getGoesToAsOptions();

    this.pdForm = this.fb.group({
      name: [this.pd.name, Validators.required],
      desc: [this.pd.desc],
      loc: [this.pd.loc],
      itemsseen: this.fb.array([])
    })
  }

  get itemsseenForms() {
    return this.pdForm.get('itemsseen') as FormArray
  }

  addItemSeen() {
    const itemseen = this.fb.group({
      desc: [''],
      goesTo: [''],
      whereInPic: ['']
    })

    this.itemsseenForms.push(itemseen)
    console.log('pdForm', this.pdForm)
  }

  deleteItemSeen(i) {
    this.itemsseenForms.removeAt(i);
  }


  ngOnDestroy() {
    this.subs.forEach((sub) => sub.unsubscribe());
  }

  formSubmit() {
    console.log('form submitted');
  }

}
