import { Component, OnInit, Output, EventEmitter, ViewChild, ElementRef, AfterViewInit, HostListener, ViewEncapsulation, Renderer2 } from '@angular/core';
import { Timestamp } from '@angular/fire/firestore';
import { ActivatedRoute } from '@angular/router';
import { AnnoService, DRAWTOOLS, PicDoc, PicdocService, IDeactivatableComponent, UserService } from '@compvid/xplat/features';
import { IonLabel, IonRouterOutlet, IonText, ModalController } from '@ionic/angular';
import { IonBackButtonDelegateDirective } from '@ionic/angular/directives/navigation/ion-back-button';
import { TwicImgComponent } from '@twicpics/components/angular13';
import { PicdocformComponent, PdclosemodalComponent } from 'libs/xplat/ionic/features/src/lib/ruskdata/components';
import { fromEvent, interval, Observable, pairwise, switchMap, takeUntil, take, tap } from 'rxjs';
import { environment } from '../../environments/environment'


@Component({
  selector: 'compvid-picpage',
  templateUrl: './picture.page.html',
  styleUrls: ['./picture.page.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class PicturePage implements OnInit, IDeactivatableComponent {

  @ViewChild(PicdocformComponent) picform: PicdocformComponent;


  @ViewChild('piccanvas') piccanvas: ElementRef<HTMLDivElement> = {} as ElementRef;
  @ViewChild('mycanvas') canvas: ElementRef<HTMLCanvasElement> = {} as ElementRef;

  // @ViewChild('wrapper') wrapper: ElementRef<HTMLDivElement> = {} as ElementRef;

  img_direct: HTMLImageElement

  @ViewChild('picimg') picimg: ElementRef<HTMLImageElement> = {} as ElementRef;
  @ViewChild('current_tool') current_tool: ElementRef<HTMLButtonElement> = {} as ElementRef;

  picdoc: PicDoc;
  extern_img_src;

  // TwicPics service control attributes
  twicImg: HTMLImageElement
  twicsrc; /// selects the image to be supplied
  twic_transform; // identifies transforms

  @Output() abandoningEdits = new EventEmitter();
  dataReturnedFromModal: any;

  // end TwicPics

  isFav = false;
  constructor(public picdocService: PicdocService,
    public route: ActivatedRoute,
    public renderer2: Renderer2,
    public modalController: ModalController,
    private routerOutlet: IonRouterOutlet,
    private anno: AnnoService) { }


  // seems like we need ionViewDidEnter for img to be loaded
  ionViewDidEnter() {
    console.log('***PicturePage ionViewDidEnter***');

    this.annoInit('picimg'); // choose annotatable img source
  }



  private onLoadImg() {
    console.log('*** loadend event ***');
    this.logImg('onLoadImg')
  }
  ngOnInit() { // looking for picdoc
    console.log('***PicturePage ngOnInit***');


    this.picdoc = this.route.snapshot.data['picdoc']
    console.log('PP loading ', this.picdoc.id);
    this.twicsrc="image:"+this.picdoc.img_basename;

    this.twic_transform='none'; // stop shrink interaction with annotorius

    console.log('ngOnInit twicsrc', this.twicsrc);

    this.extern_img_src = `${environment.twicpics.paths[0]}${this.picdoc.img_basename}`
    console.log('ngOnInit picdoc', this.picdoc);
    console.log('ngOnInit extern_img_src', this.extern_img_src);

    this.isFav = this.picdocService.isFavOf(this.picdoc);
  }

  logLoad() {
    const picel = this.picimg.nativeElement
    console.log('annoInit picel', picel);
    this.renderer2.listen(picel,
      "load",
      () => console.log("load!")
   );
  }
  // hook up annotorius to this image
  annoInit( imageSel : string | HTMLImageElement) {

    //console.log('annoInit with', imageSel);
    const annoConfig = {
      image: imageSel,
      disableEditor: false,
      drawOnSingleClick: true,
      widgets: [
        { widget: 'COMMENT' },
        { widget: 'TAG', vocabulary: [
           'Art', 'Clothing','Cookware', 'Electronics','Furniture',
           'Jewelry', 'Houseware', 'Tool','Trinket'] }
      ]
      // TODO implement
      // serverTime: Timestamp.
    }
    this.anno.annoSetup(annoConfig);

    const drawToolsList = ['']
    this.anno.setupToolbar('AnnotoriousToolbarcontainer',
    [DRAWTOOLS.FREEHAND] // always get rect and square in default
    );
    this.anno.setDrawingTool(DRAWTOOLS.POLYGON);

    this.anno.setAnnotations(this.picdoc.annotations);
    console.log('PP annoInit annotations are', this.anno.getAnnotations());
  }

  abandonEdits(){
    console.log('ABANDON SHIP');
  }
  addItem(evt) { // user clicked addItem button so bfring up blank new line in form
    this.picform.addItemSeen(evt);
  }

  clickFav() {
    this.isFav = !this.isFav;
    this.picdocService.setFavState(this.picdoc, this.isFav);
  }
  deletePicture(picdocid:string) {
    console.log('trash pic', picdocid);
    // nav back
  }


  onDomChange(mutationRecord: MutationRecord){
    if(mutationRecord.type=='attributes') {
      const name = mutationRecord.attributeName;
      const was = mutationRecord.oldValue;
      const isNow = mutationRecord.target['classList']
      console.log(`domchange ${name} from ${was} to classList of ${isNow} `)
      // console.log('mutationRecord', mutationRecord);
    }
  }

  onResize(resizeRect){
    console.log('PP onResize got input', resizeRect);
    const img = document.querySelector('img')  as HTMLImageElement;
    if(this.imgSane(img) ){
      console.log('onResize sees sane img so calling setCanvas (skipping)');
          } else {
      console.log('onResize skipping setCanvas call')
    }
  }

  // close page safety
  canDeactivate(): Observable<boolean> | Promise<boolean> | boolean {
    // ask child form if there are unsaved changes (isDirty)
    const areUnsavedChanges = true;

    let canDeactivate = true;

    if (areUnsavedChanges) {
      canDeactivate = window.confirm('Are you sure you want to leave this page?');
    }

    return canDeactivate;
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
        this.abandoningEdits.emit();
      }
    });

    return await modal.present();
  }


  // UTILITY
  private imgSane(img: HTMLImageElement): boolean {
    if (!img) {
      console.warn('PicturePage no img in setCanvas() ')
      return false;
    }
    if(!img.complete){
      console.warn('PicturePage img not yet complete', img);
      return false;
    }
    if(! (img.naturalWidth>0) ) {
      console.warn('PicturePage img no naturalWidth yet', img.naturalWidth)
      return false;
    }
    console.log('img is sane');
    return true;
  }

  private logSizes(elname, el) {
    console.log(`PP ${elname} NW NH | OW OH | O/N-Wscale O/N-Hscale`,
    el.naturalWidth,
    el.naturalHeight, '|',
    el.offsetWidth,
    el.offsetHeight, '|',

    el.offsetWidth / el.naturalWidth,
    el.offsetHeight / el.naturalHeight
    )

    if(el.offsetWidth != el.clientWidth || el.offsetHeight != el.clientHeight) {
      console.log( `PP ${elname} different clientW clientH`, el.clientWidth,
      el.clientHeight)
    }
  }
  private logImg(prefix:string){
    if(!this.twicImg){
      console.log(`from ${prefix} no twicImg`);
      return;
    }
    this.logSizes('twicimg', this.twicImg);
  }

}
