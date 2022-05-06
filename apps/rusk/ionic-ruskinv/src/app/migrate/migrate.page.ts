import { Component, OnDestroy, OnInit } from '@angular/core';
import { RuskdataService, PicDoc, PicDocWithItemsSeen } from '@compvid/xplat/features';
import { FormBuilder, FormGroup, FormArray, FormControl } from '@angular/forms';
import { Observable, Subscription } from 'rxjs';

interface pdItem {
  name: string,
  desc?: string,
  text?: string
};

@Component({
  selector: 'compvid-migrate',
  templateUrl: './migrate.page.html',
  styleUrls: ['./migrate.page.scss'],
})
export class MigratePage implements OnInit, OnDestroy {
  subs: Subscription[] = [];

  pdwis$: Observable<PicDocWithItemsSeen[]>;

  // try one form for the page
  picdataForm: FormGroup;


  picDesc: {
    items: pdItem[]
  }

  constructor(private ds: RuskdataService, private fb: FormBuilder) {}

  ngOnInit() {
    this.pdwis$ = this.ds.picdocsWithItemSeens$; // for the template
    this.subs.push(this.ds.picdocsWithItemSeens$.subscribe(this.buildForms));

    this.ds.getImageListInPicDocs();
  }

  ngOnDestroy(): void {
      this.subs.forEach(sub => sub.unsubscribe());
  }

  // build formas based on picdocs
  // one wrapper form, and then one FormArray holding a
  // FormGroup for each picture.

  // The per-picture FormGroups will be expandable with a
  // FormArray of desc/text/goesTo entries descriptions)
  buildForms(pdarray) {
    console.log('buildForms sees pdarray', pdarray);
    this.picdataForm = new FormGroup({
      // any all-pictures fields?

      // the per-picture formgroups
      picdataArray: new FormArray([])
    })
    // console.log("build forms sees picdocs", pd)
    console.log('buildForms picdataForm', this.picdataForm);
    const allpicsArray = this.picdataForm?.get('picdataArray') as FormArray;
    pdarray.forEach( pd => {
      const picForm = new FormArray([]);

      allpicsArray.push(picForm);
    });
    console.log('leave buildForms picdataForm', this.picdataForm);

  }

  addDesc(pdIndex, desc) {
    this.picdataForm.get('picdataArray')[pdIndex]
  }
  addText(pdIndex, text) {

  }

}
