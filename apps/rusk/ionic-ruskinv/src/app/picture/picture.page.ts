import { Component, OnInit, Output, EventEmitter, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import { Timestamp } from '@angular/fire/firestore';
import { ActivatedRoute } from '@angular/router';
import { PicDoc, PicdocService, UserService } from '@compvid/xplat/features';
import { TwicImgComponent } from '@twicpics/components/angular13';
import { PicdocformComponent } from 'libs/xplat/ionic/features/src/lib/ruskdata/components';
import { Observable } from 'rxjs';


@Component({
  selector: 'compvid-picpage',
  templateUrl: './picture.page.html',
  styleUrls: ['./picture.page.scss'],
})
export class PicturePage implements OnInit, AfterViewInit {
  picdoc: PicDoc;

  isFav = false;

  @ViewChild(PicdocformComponent) picform: PicdocformComponent;

  @ViewChild(TwicImgComponent) twic: TwicImgComponent;

  @ViewChild('mycanvas') mycanvas: ElementRef<HTMLCanvasElement> = {} as ElementRef;
  public context: CanvasRenderingContext2D;

  ngAfterViewInit(): void {
    this.context = this.mycanvas.nativeElement.getContext('2d');
  }

  ionViewDidEnter() {
    this.initCanvas();
  }

  constructor(public picdocService: PicdocService,
    public route: ActivatedRoute) { }

  ngOnInit() { // looking for picdoc
    this.picdoc = this.route.snapshot.data['picdoc']
    this.isFav = this.picdocService.isFavOf(this.picdoc);
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

  initCanvas() {
    const twicPos = this.twic.wrapperElementRef.nativeElement.getBoundingClientRect();
    console.log('initCanvas sees twicPos', twicPos);
    console.log('initCanvas sees mycanvas', this.mycanvas);
    //twicPos.clientWidth;
    console.log('initCanvas sees second mycanvas', this.mycanvas);

  }
  // draw on picture for itemssen
  drawOn(evt){
    console.log('drawOn got', evt)

  }
}
