import { Component, ViewChild, OnDestroy, OnInit } from '@angular/core';
import { RuskdataService, PicDoc, PicDocWithItemsSeen, PicdocService } from '@compvid/xplat/features';
import { FormBuilder, FormGroup, FormArray, FormControl } from '@angular/forms';
import { Observable, Subscription } from 'rxjs';
import { NgxCsvParser, NgxCSVParserError } from 'ngx-csv-parser';

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
  csvRecords: any;
  header: boolean = true;
  @ViewChild('fileImportInput') fileImportInput: any;

  subs: Subscription[] = [];

  pdwis$: Observable<PicDocWithItemsSeen[]>;

  // try one form for the page
  picdataForm: FormGroup;


  picDesc: {
    items: pdItem[]
  }

  constructor(private ds: RuskdataService,
    private picdocService: PicdocService,
    private fb: FormBuilder,
    private ngxCsvParser: NgxCsvParser) {}

  ngOnInit() {
    this.pdwis$ = this.ds.picdocsWithItemSeens$; // for the template
    this.subs.push(this.ds.picdocsWithItemSeens$.subscribe(this.buildForms));

    this.ds.getImageListInPicDocs();
  }

  ngOnDestroy(): void {
      this.subs.forEach(sub => sub.unsubscribe());
  }


  // for each record in the csvRecords, make a PicDoc and file it
  async genPicDocs() {

    console.log('csvRecords', this.csvRecords);
    this.csvRecords?.forEach(rec =>{
      const pd: PicDoc = {
        ...rec,
        uploadedBy: 'TESTER',
        recipients: [],
        numItemsseen: 0,
        itemsseen: []
      };
      this.picdocService.addPicDoc(pd).then(dbpd => console.log('created',dbpd.id));
    })
  }

  fileChangeListener($event: any): void {

    const files = $event.srcElement.files;
    this.header = (this.header as unknown as string) === 'true' || this.header === true;

    this.ngxCsvParser.parse(files[0], { header: this.header, delimiter: ',' })
      .pipe().subscribe({
        next: (result): void => {
          console.log('Result', result);
          this.csvRecords = result;
        },
        error: (error: NgxCSVParserError): void => {
          console.log('Error', error);
        }
      });
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
