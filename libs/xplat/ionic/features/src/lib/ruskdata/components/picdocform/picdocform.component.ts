import { AfterContentChecked, Component, EventEmitter, Input, OnDestroy, OnInit, Output, ViewChild, ViewEncapsulation } from '@angular/core';
import { FormArray, FormBuilder, FormGroup } from '@angular/forms';
import { AnnoService, AEB, GoesToService, GoesToOption, PicdocService, PlaceOptionsService, PicDoc } from '@compvid/xplat/features';
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

  pdForm!: FormGroup;

  isFav = false;

  text = "ionic Picdocform";

  anno$: Observable<any>;
  subs: Subscription[] = [];

  constructor(

    public picDocService: PicdocService,
    public placeOptionsService: PlaceOptionsService,
    public goesToService: GoesToService,
    public annoService: AnnoService,
    public fb: FormBuilder,
    public modalController: ModalController,
    private routerOutlet: IonRouterOutlet,
    ) {
    this.anno$ = this.annoService._annoEvents$;
  }

  ngOnInit() {

    this.gtoptions$ = this.goesToService.getGoesToAsOptions();
    this.setUpForm();

    this.subs.push(
      this.anno$.pipe(
        tap(ae => this.logAE(ae))
      ).subscribe(ae => this.aeHandler(ae))
    ) // end of pushed Subscription
  }

  ngOnDestroy() {
    this.subs.forEach((sub) => sub.unsubscribe()); // just in case boilerplate
  }

  // create the empty form data objects
  setUpForm() {
    console.log('PDForm setupForm');
    this.pdForm = this.fb.group(
          {
            name: [this.pd?.name],
            desc: [this.pd?.desc],
            loc: [this.pd?.loc],
            favOf: [this.pd?.favOf],
            itemsseen: this.fb.array([])
          }
        )

        //sort the array by addedOn TODO
        this.pd?.itemsseen?.forEach((its => this.putItemsseenToForm(its)))
  }

  resetForm() {
    this.setUpForm();
  }

  // get favOf(): string[] {
  //   return this.pdForm.get('favOf') as string[]
  // }

  // if the annotation is about an item already in the PicDoc
  // then return the matching itemseen entry

  putItemsseenToForm(its:any){
    const itemseen = this.fb.group({
      desc: [its.desc],
      addedOn: [its.addedOn],
      category: [its.category],
      annoID: [its.annoID],
      goesTo: [],
    })

    this.itemsseenForms.insert(0,itemseen);
  }

  get itemsseenForms() {
    return this.pdForm.get('itemsseen') as FormArray
  }

  // javascript event carried because children need it, and so base has to accept it
  addItemSeen(evt:any) {
    // console.log('enter addItemSeen, form:', this.pdForm)
    const itemseen = this.fb.group({
      desc: [''],
      addedOn: [''],
      category: [''],
      goesTo: [],
      annoID: [''],
    })

    // this.itemsseenForms.push(itemseen)
    this.itemsseenForms.insert(0,itemseen);
    this.itemsseenForms.markAsDirty();
  }

  removeItemSeen(idx:number) {
    const row =  this.itemsseenForms.at(idx);
    console.log('removeItemSeen idx row', idx, row)
    if(row.get('annoID')){
      this.annoService.cancelSelected();
      this.annoService.removeAnnotation(row.get('annoID')?.value);
    }
    this.itemsseenForms.removeAt(idx);
    this.itemsseenForms.markAsDirty();
  }

  deleteItemSeen(i: number) {
    const annoId = this.annoIdFromItemsRow(i);
    console.log('deleteItemSeen annoId', annoId);
    this.annoService.cancelSelected();
    this.annoService.removeAnnotation(annoId);
    this.itemsseenForms.removeAt(i);
    this.itemsseenForms.markAsDirty();
  }

  toggleFav() {
    this.isFav = !this.isFav;
  }

  private pdFormReverted(): boolean {
    return false;
  }

  clearGoesTo(idx: number) {
    this.itemsseenForms.at(idx).patchValue({goesTo:''})
  }



  closeForm() {
    // confirm closing if form is dirty
  }

  formSubmit() {
    const val = this.pdForm.value;
    const annoArray: string[] = [];
    const annotations = this.annoService.getAnnotations();
    console.log('PDForm submit annotations', annotations );

    const changes = { // 1st attempt, but has prototypes and unchanged fields, too
      id: this.pd.id,
      annotations: annotations,
      desc: val.desc,
      loc: val.loc,
      itemsseen: this.itemsseenForms.value

    }
    console.log('PDForm calculated change object', changes);
    this.picDocService.updatePicDoc(changes).then(
      it => console.log('PDForm update got back',it)
    )
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
    console.log('annoIdFromItemsRow', rowAnno)
    return rowAnno.value
  }

  itemseenFromAnnoId() {

  }

  // find the itemseen row who annotation is the given ID
  // future - it might be that a row has *multiple* annotation?
  rowIdxFromAnnodId(aeid: string): number {
    if(!aeid){
      console.warn('rowIdxFromAnnoId got empty param');
      return -1;
    }
    const numRows = this.itemsseenForms.length;
    for(let idx=0; idx<numRows; idx += 1) {
      if(this.annoIdFromItemsRow(idx) === aeid){
        return idx;
      }
    }
    // if we get here, *no* row has the ID
    console.warn('PDForm rowIdxFromAnnoId fail for aeid', aeid);
    return -1;
  }
  pulseItemSeen(annotationId: string) {

  }
  // if you start from an annotation then there isn't an existing item
  addItemFromAnnotationEvent(ae: any) {
    const anno = ae.payload.annotation
    // ae can have 1 or multiple body,
    // depends on what user fills out
    console.log('addItemFromAnnotationEvent anno', anno)
    const {comments, tags} = this.annoService.extractCommentsAndTags(ae);
    console.log('comments', comments, 'tags', tags)
    const annoForForm = {
      desc: comments.join(' // '),
      category: tags.join(' // '),
      annoID: anno['id']
    };
    this.putItemsseenToForm(annoForForm );
    console.log('addItemFromAnnotationEvent sending', annoForForm);
    this.itemsseenForms.markAsDirty();
  }

  updateAnnotation(ae) {
    this.itemsseenForms.markAsDirty();

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
