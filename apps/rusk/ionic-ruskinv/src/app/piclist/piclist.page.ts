import { AfterContentInit, AfterViewInit, Component, OnDestroy, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { Timestamp } from '@angular/fire/firestore';
import { GoesToOption, GoesToService, PicDoc, PicdocService } from '@compvid/xplat/features';
import { environment } from '../../environments/environment'

import { take, tap } from 'rxjs/operators';
import { Observable, Subscription } from 'rxjs';
import { IonRadioGroup, IonSelect } from '@ionic/angular';


@Component({
  selector: 'compvid-piclist',
  templateUrl: './piclist.page.html',
  styleUrls: ['./piclist.page.scss'],
  encapsulation: ViewEncapsulation.None
})
export class PiclistPage implements OnInit, AfterViewInit, OnDestroy {

  pdArray: PicDoc[] = [];
  @ViewChild('gtselect') gtselect: IonSelect;
  @ViewChild('numGTO') numGTO: IonRadioGroup;
  twicdomain = environment.twicpics.domain;

  // FILTER CONTROLS
  filterFavOnly = false;
  filterGoesToMe = false;
  filterGoesToSomeone = false;
  gtoptions$!: Observable<GoesToOption[]>;

  filteredSub: Subscription;
  subs: Subscription[] = [];

  constructor(public picdocService: PicdocService,
    public goesToService: GoesToService,) { }

  ngOnInit() {
    this.gtoptions$ = this.goesToService.getGoesToAsOptions()
    // .pipe(
    //   tap(arr => arr.push({label:'someone', value: 'someone', id: 'someone'}))
    // );
  }

  // use ionViewWill* because init/destroy not always called by Ionic (keeps pages on a stack)
  ionViewWillEnter() {
    this.doSubscribe();
  }

  ionViewWillLeave() {
    console.log('piclistpage ionViewWillLeave', this.subs)
    this.subs.forEach(s => {s.unsubscribe()})
    console.log('piclistpage ionViewWillLeave after unsub',this.subs)
  }

  ngOnDestroy(): void { // just in case
    this.subs.forEach(s => {s.unsubscribe()})
  }

  ngAfterViewInit(): void {

  }

  abandonEdits(){
    console.log('ABANDON SHIP');
  }

  // FILTERS AND EXPORT

  // subscribe based on AND of
  // * favorites status (bbolean),
  // * number of recipients (don't-care, 0, 1, many), and
  // * number of items seen (don't-care, 0, 1, many)
  doSubscribe() {
    console.log('doSubscribe');

    if( this.filteredSub) {
      this.filteredSub.unsubscribe();
    }

    const sub = this.picdocService.getFilteredPicDoc(
      this.filterFavOnly? 'T' : 'F',
      this.numGTO.value,
      -1).pipe(
      take(1), // so we get completion
    ).subscribe(pda => this.pdArray = pda);

    this.filteredSub = sub;

  }
  clickFav() {
    this.filterFavOnly = !this.filterFavOnly;
    this.doSubscribe();
  }

  gtNumChanged(count:number) {
    console.log('goesTo becomes', count)
    if (count > 0) {
      this.clearGoesTo();
    }
    this.doSubscribe();

  }
  clearGtNumChanged() {
    this.numGTO.value=''
  }

  clearGoesTo() {
    console.log('clearGoesTo')
    this.gtselect.value=''
    this.doSubscribe();
  }
  
  goesToChanged(evt){
    console.log('goesToChanged target list to', evt.detail.value)
    if(evt) { // then numeric is selected, not the list 
      this.clearGtNumChanged();
    // filter on picdoc recipients array contains any of the target list of ID
    }
    this.doSubscribe();

  }

}
