import { AfterContentChecked, Component, EventEmitter, Input, OnDestroy, OnInit, Output, ViewChild, ViewEncapsulation } from '@angular/core';
import { Timestamp } from '@angular/fire/firestore';
import { FormArray, FormBuilder, FormGroup } from '@angular/forms';
import { AnnoService, AEB, GoesToService, GoesToOption,
  PicdocService, PlaceOptionsService, UserService,
  PicDoc, ItemSeen, ControlsOf } from '@compvid/xplat/features';
import { IonAccordionGroup, IonRouterOutlet, ModalController } from '@ionic/angular';
import { Observable, Subscription, tap } from 'rxjs';
import { PdclosemodalComponent } from '../pdclosemodal/pdclosemodal.component'

// ionic
@Component({
  selector: 'compvid-picdocform',
  templateUrl: 'picdocform.component.html',
  styles: [`
    #ishheader::part(native) {
      padding-left: 0;
      background-color:red;
    }
  `]
})
export class PicdocformComponent implements OnInit, OnDestroy /* implements AfterContentChecked */ {

  @Input()
  pd!: PicDoc

  @ViewChild(IonAccordionGroup) accordionGroup!: IonAccordionGroup;

  @Output() abandonEdits = new EventEmitter();
  dataReturnedFromModal: any;
  gtoptions$!: Observable<GoesToOption[]>;

  isFav = false;

  text = "ionic Picdocform";

  anno$: Observable<any>;
  subs: Subscription[] = [];
  pdForm = this.fb.group(
    {
      name: [''],
      desc: [''],
      loc: [''],
      itemsseen: this.fb.array([
        this.fb.group({
          id: [''],
          isDeleted: [false],
          addedOn: [new Date()],
          addedBy: [''],
          twicFocus: [''],
          desc: [''],
          category: [['']], // tags from annotations
          annoID: [''],
          goesTo: [''],
        })
      ])
    }
  )

  constructor(

    public picDocService: PicdocService,
    public placeOptionsService: PlaceOptionsService,
    public goesToService: GoesToService,
    public annoService: AnnoService,
    public userService: UserService,
    public fb: FormBuilder,
    public modalController: ModalController,
    private routerOutlet: IonRouterOutlet,
    ) {
    this.anno$ = this.annoService._annoEvents$;
  }

  ngOnInit() {

    this.gtoptions$ = this.goesToService.getGoesToAsOptions();
    this.addIdsToItemsseen();
    this.setUpForm();


    this.subs.push(
      this.anno$.pipe(
        tap(ae => this.logAE(ae))
      ).subscribe(ae => this.aeHandler(ae))
    ) // end of pushed Subscription
  }

  addIdsToItemsseen() {
    this.pd.itemsseen?.forEach( (its, idx) => {
      if (!its.id) { // if it's got an ID, leave it alone
        its.id = 's_'+idx // bug here - what if 's_3' prev assigned
      }
    })
    console.log('after addItemsToItemsseen', this.pd.itemsseen)
  }

  ngOnDestroy() {
    this.subs.forEach((sub) => sub.unsubscribe()); // just in case boilerplate
  }

  // create the empty form data objects
  setUpForm() {
    console.log('PDForm setupForm');
    this.putPDtoForm(this.pd);

    // this.pdForm = this.fb.group(
    //       {
    //         name: [this.pd?.name],
    //         desc: [this.pd?.desc],
    //         loc: [this.pd?.loc],
    //         favOf: [this.pd?.favOf],
    //         itemsseen: this.fb.array([])
    //       }
    //     )

        //sort the array by addedOn TODO
        // this.pd?.itemsseen?.forEach((its => this.putItemsseenToForm(its)))
     }

  resetForm() {
    this.pdForm.reset();
  }
  putPDtoForm(pd:PicDoc){
    if(pd.name) this.pdForm.controls.name.setValue(pd.name);
    if(pd.desc) this.pdForm.controls.desc.setValue(pd.desc);
    if(pd.loc) this.pdForm.controls.loc.setValue(pd.loc);
    pd.itemsseen?.forEach(pdis => {
      const itemseen = this.fb.group({
        id: pdis.id ?? '',
        isDeleted: false,
        addedOn: pdis.addedOn ?? new Date(),
        addedBy: pdis.addedBy,
        twicFocus: pdis.twicFocus,
        desc: pdis.desc ?? '',
        category: [pdis.category ?? []],
        annoID: [pdis.annoID ?? ''], // might not be an anno
        goesTo: [pdis.goesTo?.to ?? null],
      })
      this.pdForm.controls.itemsseen.push(itemseen)
    })
  }


  get itemsseenForms() {
    return this.pdForm.get('itemsseen') as FormArray
  }

  goesToChanged(e: any, idx: number){
    console.log('goesToChanged',e)
    const toId = e.detail.value
    console.log('idx, toId', idx, toId)
  }
  // javascript event carried because children need it, and so base has to accept it
  addItemSeen(evt:any) {
    // console.log('enter addItemSeen, form:', this.pdForm)

    const itemseen = this.fb.group({
      desc: [''],
      addedOn: [new Date()],
      addedBy: this.userService.uid,
      category: [''],
      goesTo: [],
      annoID: [''],
    })

    // this.itemsseenForms.push(itemseen)
    this.itemsseenForms.insert(0,itemseen);
    this.pdForm.get('itemsseen')?.markAsDirty();
  }

  removeItemSeen(idx:number) {
    const row =  this.itemsseenForms.at(idx);
    console.log('removeItemSeen idx row', idx, row)
    if(row.get('annoID')){
      this.annoService.cancelSelected();
      this.annoService.removeAnnotation(row.get('annoID')?.value);
    }
    this.itemsseenForms.removeAt(idx);
    this.pdForm.get('itemsseen')?.markAsDirty();
  }

  private pdFormReverted(): boolean {
    return false;
  }

  clearGoesTo(idx: number) {
    console.log('clearGoesTo', idx)
    this.itemsseenForms.at(idx).patchValue({goesTo:''})
  }

  closeForm() {
    // confirm closing if form is dirty
  }

  formSubmit() {
    const val = this.pdForm.value;
    const changes = this.getFormChanges();
    changes.id = this.pd.id;

    const annotations = this.annoService.getAnnotations();
    if(annotations) {
      changes['annotations'] = annotations;
    }

    this.picDocService.updatePicDoc(this.pd, changes)
      .then(
      () => {
        console.log('PDForm update succeeded');
        this.pdForm.markAsPristine();
      })
      .catch((err) => {
        console.warn('PDF call to updatePicDoc failed', err);
        throw new Error(err)
      })
  }


  private getFormChanges(): Partial<PicDoc> {
    console.log('PDF gFC form', this.pdForm.value);
    console.log('PDF gFC based on PD', this.pd);
    //consider entire form as a first step
    const changes = {
      name: this.pdForm.get('name')?.value ?? '',
      desc: this.pdForm.get('desc')?.value ?? '',
      loc: this.pdForm.get('loc')?.value ?? '',
      itemsseen: this.itemsseenForms.value
    }

    return changes;
  }

  async openModal() {
    const modal = await this.modalController.create({
      component: PdclosemodalComponent,
      presentingElement: this.routerOutlet.nativeEl,
      cssClass: 'pdclose-modal',
      componentProps: {
        "paramID": 123,
        "paramTitle": "Really abandon changes?"
      }
    });

    modal.onDidDismiss().then((dataReturned) => {
      if (dataReturned !== null) {
        this.dataReturnedFromModal = dataReturned.data;
        console.log('Modal Sent Data :', dataReturned);
      }
      if(dataReturned.data == 'discard'){
        this.abandonEdits.emit();
      }
    });

    return await modal.present();
  }

  /*  Annotation event handling
  */

    // On Annotation Events (ae) we update the form to just to display and denormalize data.
  // The Annotation itself is stored in the itemseen block so it reaches the backend
  // and its in-picture representation/manipulation is done by the Annotorius library

  addAnnotationForRow(idx:number) {

  }
  aeHandler(ae: any){

    switch (ae.type) {
      case 'createAnnotation':
        this.addItemFromAnnotationEvent(ae)
      break;

      case 'updateAnnotation':
        this.updateAnnotation(ae);
      break;

      case 'selectAnnotation':
        this.highlightItemSeenRow(ae.payload.id, true);
      break;

      case 'cancelSelected':
        this.highlightItemSeenRow(ae.payload.id, false);
      break;

      case 'deleteAnnotation':
        this.deleteAnnotationFromItemSeen(ae.payload.id);
      break;

      case 'mouseEnterAnnotation':
      case 'mouseLeaveAnnotation':
      case 'clickAnnotation':
        this.pulseItemSeen(ae.id);
      break;

      case 'annotationsLoaded':
        console.log('annotations loaded from', ae.payload['src']);
      break;

      default:
        console.warn('unknown annotation', ae);

    }

  }
  logAE(ae: any){
    console.log('PF Ionic gets ae', ae)
  }

  highlightItemSeenRow(annotationId: string, highlight: boolean){

  }
  // fires when select in text area or hit buttons
  enterRow(idx: number) {
    const id = this.annoIdFromItemsRow(idx);
    console.log('enterRow ', idx, ' => id ', id)
      this.annoService.selectAnnotation(id);
  }

  annoIdFromItemsRow(idx: number) : string {
    const itemseen = this.itemsseenForms.at(idx) as FormGroup;
    const rowAnno = itemseen.controls['annoID']
    console.log('annoIdFromItemsRow maps idx to anno', idx, rowAnno)
    return rowAnno.value
  }

  itemseenFromAnnoId(annoId: string) {
    // look through the existing itemsseen for one with
    // an annotation matching this ID
    const idx = this.rowIdxFromAnnodId(annoId);
    if(idx>-1) {  //maybe not found?
      const its = this.itemsseenForms.at(idx);
      console.log('PDF itemseenFromAnnoId found ITS', its);
      return its;
    } else {
      console.warn('PDF itemseenFromAnnoId no IDX for ', annoId)
    }
    return null;
  }

  // find the itemseen row who annotation is the given ID
  // future - it might be that a row has *multiple* annotation?
  rowIdxFromAnnodId(aeid: string): number {
    if(!aeid){
      console.warn('PDF rowIdxFromAnnoId got empty param');
      return -1;
    }
    const numRows = this.itemsseenForms.length;
    for(let idx=0; idx<numRows; idx += 1) {
      if(this.annoIdFromItemsRow(idx) === aeid){
        return idx;
      }
    }
    // if we get here, *no* row has the ID
    console.warn('PDF rowIdxFromAnnoId fail for aeid', aeid);
    return -1;
  }
  pulseItemSeen(annotationId: string) {

  }
  // if you start from an annotation then there isn't an existing item
  addItemFromAnnotationEvent(ae: any) {
    const anno = ae.payload.annotation
    // ae can have 1 or multiple body,
    // depends on what user fills out
    console.log('PDF addItemFromAnnotationEvent anno', anno)
    const {comments, tags} = this.annoService.extractCommentsAndTags(ae);
    console.log('PDF addItemFromAnnotationEvent comments', comments, 'tags', tags)
    const annoForForm = {
      desc: comments.join(' // '),
      category: tags, // .join(' // '),
      annoID: anno['id']
    };
    this.putAnnoItemsseenToForm(annoForForm );
    this.itemsseenForms.markAsDirty();
  }

  // just for adding an itemseen entry based on an annotation
  putAnnoItemsseenToForm(its:any){
    console.log('PDF putAnnoItemsseenToForm got', its);
    const itemseen = this.fb.group({
      desc: [its.desc],
      addedOn: [new Date()],
      addedBy: this.userService.uid,
      category: [its.category],
      annoID: [its.annoID],
      goesTo: [], // is empty at start when from annotation
    })

    this.itemsseenForms.insert(0,itemseen);
  }
  updateAnnotation(ae) {
    const aeid = ae.payload.id
    const {comments, tags} = this.annoService.extractCommentsAndTags(ae);
    console.log('PDF updateAnnotation id, comments, tags', aeid, comments, tags)
    const ITS = this.itemseenFromAnnoId(ae.payload.id);
      // 'its' is a FormGroup from the FormArray
      if(ITS) {
        // copy annotation into ITS
        ITS.get('category')?.setValue(tags);
        this.itemsseenForms.markAsDirty();
        console.log('PDF updateAnnotation sets ITS to', ITS)
      }
  }

  deleteAnnotationFromItemSeen(aeId: string) {
    if(!aeId){
      console.warn('PDForm deleteAnnotationFromItemSeen got no param aeId');
      return;
    }
    const rowIdx = this.rowIdxFromAnnodId(aeId);
    if(rowIdx >=0){
      const row = this.itemsseenForms.at(rowIdx);
      row['annoID']='';
    }
    this.itemsseenForms.markAsDirty();

  }

}
