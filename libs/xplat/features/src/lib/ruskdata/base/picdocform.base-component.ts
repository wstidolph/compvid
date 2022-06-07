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

    this.pdForm = this.fb.group(
      {
        name: [this.pd.name],
        desc: [this.pd.desc],
        loc: [this.pd.loc],
        itemsseen: this.fb.array([])
      }
    )

    //sort the array by addedOn TODO
    this.pd.itemsseen?.forEach((its => this.putItemsseenToForm(its)))
  }

  putItemsseenToForm(its:any){
    const itemseen = this.fb.group({
      desc: [its.desc],
      addedOn: [its.addedOn],
      category: [its.category],
      whereInPic: [its.whereInPic],
      goesTo: [''],
    })

    this.itemsseenForms.insert(0,itemseen);
  }
  get itemsseenForms() {
    return this.pdForm.get('itemsseen') as FormArray
  }

  // javascript event carried because children need it, and so base has to accept it
  addItemSeen(evt:any) {
    console.log('base, enter addItemSeen, form:', this.pdForm)
    const itemseen = this.fb.group({
      desc: [''],
      addedOn: [''],
      category: [''],
      goesTo: [''],
      whereInPic: [''],
    })

    // this.itemsseenForms.push(itemseen)
    this.itemsseenForms.insert(0,itemseen);
  }

  removeItemSeen(idx:number) {
    this.itemsseenForms.removeAt(idx);
  }
  clearGoesTo(idx: number) {
    this.itemsseenForms.at(idx).patchValue({goesTo:''})
  }

  deleteItemSeen(i: number) {
    this.itemsseenForms.removeAt(i);
  }


  ngOnDestroy() {
    this.subs.forEach((sub) => sub.unsubscribe()); // just in case boilerplate
  }

  closeForm() {
    // confirm closing if form is dirty
  }

  formSubmit() {
    const val = this.pdForm.value;
    console.log('form submitted', this.pdForm.value);
    const changes = { // 1st attempt, but has prototypes and unchanged fields, too
      id: this.pd.id,

        desc: val.desc,
        loc: val.loc,
        itemsseen: this.itemsseenForms.value

    }
    console.log('calculated change object', changes);
    this.picdocService.updatePicDoc(changes).then(
      it => console.log('update got back',it)
    )
  }

}
