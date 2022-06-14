import { Component, OnInit, Output, EventEmitter, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import { Timestamp } from '@angular/fire/firestore';
import { ActivatedRoute } from '@angular/router';
import { PicDoc, PicdocService, UserService } from '@compvid/xplat/features';
import { IonLabel, IonText } from '@ionic/angular';
import { TwicImgComponent } from '@twicpics/components/angular13';
import { PicdocformComponent } from 'libs/xplat/ionic/features/src/lib/ruskdata/components';
import { fromEvent, Observable, pairwise, switchMap, takeUntil, tap } from 'rxjs';


@Component({
  selector: 'compvid-picpage',
  templateUrl: './picture.page.html',
  styleUrls: ['./picture.page.scss'],
})
export class PicturePage implements OnInit, AfterViewInit {

  @ViewChild(PicdocformComponent) picform: PicdocformComponent;

  @ViewChild(TwicImgComponent) twic: TwicImgComponent;

  @ViewChild('mycanvas') canvas: ElementRef<HTMLCanvasElement> = {} as ElementRef;

  private context: CanvasRenderingContext2D;
  private canvasEl: HTMLCanvasElement;

  picdoc: PicDoc;
  isFav = false;
  constructor(public picdocService: PicdocService,
    public route: ActivatedRoute) { }

  ngAfterViewInit(): void {
    this.canvasEl = this.canvas.nativeElement;

  }

  ionViewDidLoad() {

  }

  ionViewDidEnter() {
    this.initCanvas();
    const context = this.canvasEl.getContext('2d');

    context.lineWidth = 10;
    context.lineCap = 'round'
    context.strokeStyle = '#FF0';
    context.globalCompositeOperation = "multiply";
    this.context = context

    console.log('context is init to', this.context, this.context.canvas.getBoundingClientRect());

    this.captureEvents(this.canvasEl);
  }

  ngOnInit() { // looking for picdoc
    this.picdoc = this.route.snapshot.data['picdoc']
    this.isFav = this.picdocService.isFavOf(this.picdoc);
  }

  // drawing code based on
  // https://medium.com/@tarik.nzl/creating-a-canvas-component-with-free-hand-drawing-with-rxjs-and-angular-61279f577415
  private captureEvents(canvasEl: HTMLCanvasElement) {
    // this will capture all mousedown events from the canvas element
    // console.log('captureEvents rect', canvasEl, canvasEl.getBoundingClientRect());

    fromEvent(canvasEl, 'pointerdown')
      .pipe(
        // tap((e) => console.log('pointerdown',e)),
        switchMap((e) => {
          // after a mouse down, we'll record all mouse moves
          return fromEvent(canvasEl, 'pointermove')
            .pipe(
              // tap((e:PointerEvent) => console.log('pointermove e.clientX',e.clientX)),
              // we'll stop (and unsubscribe) once the user releases the mouse
              // this will trigger a 'mouseup' event
              takeUntil(fromEvent(canvasEl, 'pointerup')),
              // we'll also stop (and unsubscribe) once the mouse leaves the canvas (mouseleave event)
              takeUntil(fromEvent(canvasEl, 'pointerleave')),
              // pairwise lets us get the previous value to draw a line from
              // the previous point to the current point
              pairwise()
            )
        })
      )
      .subscribe((res: [PointerEvent, PointerEvent]) => {
        const rect = canvasEl.getBoundingClientRect();

        // previous and current position with the offset
        const prevPos = {
          x: res[0].clientX - rect.left,
          y: res[0].clientY - rect.top
        };

        const currentPos = {
          x: res[1].clientX - rect.left,
          y: res[1].clientY - rect.top
        };

        this.drawOnCanvas(prevPos, currentPos);
      });
  }
  private drawOnCanvas(
    prevPos: { x: number, y: number },
    currentPos: { x: number, y: number }
  ) {
    // incase the context is not set
    if (!this.context) {
      console.warn('asked to draw on non-exist context');
      return; }

    // start our drawing path
    this.context.beginPath();

    // we're drawing lines so we need a previous position
    if (prevPos) {
      // sets the start point
      this.context.moveTo(prevPos.x, prevPos.y); // from

      // draws a line from the start pos until the current position
      this.context.lineTo(currentPos.x, currentPos.y);

      // strokes the current path with the styles we set earlier
      this.context.stroke();
    }
  }

  abandonEdits(){
    console.log('ABANDON SHIP');
  }

  addItem(evt) {
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
    console.log('PicturePage onResize got rect', resizeRect);
    const img = document.querySelector('twicimg img')  as HTMLImageElement;
    console.log("PicturePage onResize img NW, NH is",img.naturalWidth, img.naturalHeight)
    const twicPos = this.twic.wrapperElementRef.nativeElement.getBoundingClientRect();
    console.log('PicturePage onResize sees twicPos gBRC', twicPos);
    this.canvas.nativeElement.height = img.naturalHeight;
    this.canvas.nativeElement.width = img.naturalWidth;
  }

  initCanvas() {
    const img = document.querySelector('twicimg img') as HTMLImageElement;
    console.log("img is",img.naturalWidth, img.naturalHeight)
    const twicPos = this.twic.wrapperElementRef.nativeElement.getBoundingClientRect();
    console.log('PicturePage initCanvas sees twicPos gBRC', twicPos);
    this.canvasEl.height = img.naturalHeight;
    this.canvasEl.width = img.naturalWidth;
    console.log('PicturePage initCanvas sets canvas', this.canvas.nativeElement);

  }
}
