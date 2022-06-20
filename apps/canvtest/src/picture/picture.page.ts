import { Component, OnInit, Output, EventEmitter, ViewChild, ElementRef, AfterViewInit, HostListener } from '@angular/core';

// import { TwicImgComponent } from '@twicpics/components/angular13';
import { fromEvent, interval, Observable, pairwise, switchMap, takeUntil, take, tap, finalize, merge } from 'rxjs';

interface Pen {
  lineWidth: number;
  lineCap: 'butt' | 'round' | 'square';
  strokeStyle: string;
  // see https://developer.mozilla.org/en-US/docs/Web/API/CanvasRenderingContext2D/globalCompositeOperation
  globalCompositeOperation: 'source-over' | 'source-in' | 'source-out' | 'source-atop' |
                            'destination-over' | 'destination-in' | 'destination-out' | 'destination-atop' |
                            'lighter' |  'copy' | 'xor' | 'multiply' | 'screen' | 'overlay' |
                            'darken' | 'lighten' | 'color-dodge' | 'color-burn' |
                            'hard-light' | 'soft-light' | 'difference' | 'exclusion' |
                            'hue' | 'saturation' | 'color' | 'luminosity';
}


@Component({
  selector: 'compvid-picpage',
  templateUrl: './picture.page.html',
  styleUrls: ['./picture.page.scss'],
})
export class PicturePage implements OnInit, AfterViewInit {


  @ViewChild(HTMLImageElement) img!: HTMLImageElement;

  @ViewChild('piccanvas') piccanvas: ElementRef<HTMLDivElement> = {} as ElementRef;
  @ViewChild('mycanvas') canvas: ElementRef<HTMLCanvasElement> = {} as ElementRef;

  canvases: ElementRef<HTMLCanvasElement>[] = [];

  // TODO move the context and canvasEl to getting from canvas each time
  private context!: CanvasRenderingContext2D;
  private canvasEl!: HTMLCanvasElement;


  extern_img_src = "https://stidolph.com/kestate/20220305_081449.jpg"

  isFav = false;
  constructor() { }

  pens: Pen[] = [{
    lineWidth: 10,
    lineCap: 'round',
    strokeStyle: '#FF0',
    globalCompositeOperation: 'multiply'
  }]

  tracePoints: {x:number, y:number}[] = []

  ngOnInit() { // looking for picdoc
    console.log('***ngOnInit***');
  }

  ngAfterViewInit(): void {
    console.log('***ngAfterViewInit***');
    this.logImg('ngAfterViewInit');
    this.ionViewDidEnter(); // dummy up ionic
  }

  // seems like we need ionViewDidEnter for img to be loaded
  ionViewDidEnter() {
    console.log('***ionViewDidEnter***');
    this.img = document.querySelector('img')  as HTMLImageElement;

    this.canvasEl = this.canvas.nativeElement;
    this.setCanvas(1); // set up canvas

    this.assignContext(); // just to keep from constantly fetching from canvas.nat...

    console.log('iVDE after setCanvas gets context and canvas gBCR ',
        this.context, this.canvasEl.getBoundingClientRect());

    this.setPen(0); // TODO test pen ID here for in-array

  }

  recordWithPen(){
    console.log('recording starts');
    this.captureEvents(this.canvasEl);
  }

  assignContext() : boolean {
    const ctx = this.canvasEl.getContext('2d')
    if (ctx) {
      this.context = ctx;
      console.log('assigned context', this.context)
      return true;
    } else {
      console.warn('no canvas or context, skipping assignContext');
      return false;
    }
  }

  private setCanvas(canvasid: number=1) {
    console.log('***setCanvas***');
    if(!this.imgSane(this.img)) { return; }
    console.log('canvas is HxW', this.canvasEl.height, this.canvasEl.width );
    const imgCW = this.img.clientWidth;
    const imgCH = this.img.clientHeight;
    this.canvasEl.width = imgCW;
    this.canvasEl.height = imgCH;
    console.log('picture client size (and canvas setting) is HxW', imgCH,imgCW )
  }

  // drawing code based on
  // https://medium.com/@tarik.nzl/creating-a-canvas-component-with-free-hand-drawing-with-rxjs-and-angular-61279f577415
  private captureEvents(canvasEl: HTMLCanvasElement) {
    // this will capture all mousedown events from the canvas element

    merge(fromEvent(canvasEl, 'mousedown'), fromEvent(canvasEl, 'touchstart'))
      .pipe(
        // tap((e:MouseEvent) => console.log('pointerdown eX eY',e.clientX, e.clientY)),
        switchMap((e) => {
          // after a mouse/pointer start, we'll record all mouse moves
          return merge(fromEvent<MouseEvent>(canvasEl, 'mousemove'),
                       fromEvent<TouchEvent>(canvasEl, 'touchmove'))
            .pipe(
              // we'll stop (and unsubscribe) at the end of the movement
              takeUntil(fromEvent(canvasEl, 'mouseup')),
              takeUntil(fromEvent(canvasEl, 'touchend')),
              takeUntil(fromEvent(canvasEl, 'touchcancel')),
              // we'll also stop (and unsubscribe) once the pointer leaves the canvas
              takeUntil(fromEvent(canvasEl, 'mouseleave')),
              finalize(() => this.recordTrace()),
              // pairwise lets us get the previous value to draw a line from
              // the previous point to the current point
              pairwise(),
            )
        })
      )
      .subscribe((res:[MouseEvent | TouchEvent, MouseEvent | TouchEvent]) => {
        const rect = canvasEl.getBoundingClientRect();

        let prevPos = {x:0, y:0};
        let currentPos = {x:0, y:0}
        // previous and current position with the offset
        if(res[0] instanceof MouseEvent) {
          prevPos = {
            x: res[0].clientX - rect.left,
            y: res[0].clientY - rect.top
         };
        }
        if(res[0] instanceof TouchEvent) {
          prevPos = {
            x: res[0].touches[0].clientX - rect.left,
            y: res[0].touches[0].clientY - rect.top
         };
        }
        if(res[1] instanceof MouseEvent) {
          currentPos = {
            x: res[1].clientX - rect.left,
            y: res[1].clientY - rect.top
          };
        }
        if(res[1] instanceof TouchEvent) {
          currentPos = {
            x: res[1].touches[0].clientX - rect.left,
            y: res[1].touches[0].clientY - rect.top
         };
        }
        this.recordPoint(currentPos); // for re-draw
        this.drawOnCanvas(prevPos, currentPos);
      });
  }


  // keep track of the trace
  recordPoint(tracepoint: {x: number, y: number}) {
    this.tracePoints.push(tracepoint);
  }

  recordTrace() {
    console.log("book it!", this.tracePoints);
    // file away the pen and the tracepoints as pat of the itemseen
    this.tracePoints = [];
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

  clickFav() {
    console.log('drawing markup');
    //this.isFav = !this.isFav;
    //this.picdocService.setFavState(this.picdoc, this.isFav);
  }
  deletePicture(picdocid:string) {
    console.log('trash pic', picdocid);
    // nav back
  }


  onDomChange(mutationRecord: MutationRecord){
    if(mutationRecord.type=='attributes') {
      const name = mutationRecord.attributeName;
      const was = mutationRecord.oldValue;
      // const isNow = mutationRecord.target.getAttribute(name)
      console.log(`domchange attribute ${name} from ${was}, now ${mutationRecord} `)
      // console.log('mutationRecord', mutationRecord);
    }
  }

  onResize(resizeRect: DOMRect){
    console.log('PP onResize got input', resizeRect);
    const img = document.querySelector('img')  as HTMLImageElement;
    if(this.imgSane(img) ){
      console.log('onResize sees sane img so calling setCanvas');
      this.setCanvas();
      this.recordWithPen();
    } else {
      console.log('onResize skipping setCanvas call')
    }
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
  private setPen(penId:number = 0) {
    if(penId<0 || penId>= this.pens.length) {
      console.warn(`PP got bad penId (${penId}) should be in 0..${this.pens?.length} so using default`);
      penId = 0;
    }
    this.context.lineWidth = this.pens[penId].lineWidth;
    this.context.lineCap = this.pens[penId].lineCap;
    this.context.strokeStyle = this.pens[penId].strokeStyle;
    this.context.globalCompositeOperation = this.pens[penId].globalCompositeOperation;
  }
  private logCanvasSize(prefix:string) {
    const cne = this.canvas.nativeElement
    console.log(prefix + ' canvas NE width height left top', cne.width, cne.height, cne.offsetLeft, cne.offsetTop)
  }
  private logImgSizes(elname:string, el:HTMLImageElement) {
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
    if(!this.img){
      console.log(`from ${prefix} no img`);
      return;
    }
    this.logImgSizes('img', this.img);
  }
  private onLoadImg() {
    console.log('*** loadend event ***');
    this.logImg('onLoadImg')
  }

  onTouchStart(evt: TouchEvent) {
    console.log('touchstart', evt)
  }
  onTouchMove(evt: TouchEvent) {
    console.log('touchmove', evt)
  }
  onTouchEnd(evt: TouchEvent) {
    console.log('touchEnd', evt)
  }
}
