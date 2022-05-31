import { ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { User, UserInfo } from '@angular/fire/auth';
import { Router } from '@angular/router';
import { RuskdataService, PicDoc, PicdocService, UserService, GoesToService,
        //ItemseenService, ItemSeen
        } from '@compvid/xplat/features';

import { from, Observable, Subscription } from 'rxjs'

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage implements OnInit, OnDestroy {
  picDocs: Observable<PicDoc[]>;
  user$: Observable<User | null>
  userProfile$: Observable<any>;
  info: UserInfo;
  // itemseens: Observable<ItemSeen[]>;
  subs: Subscription[] = [];

  constructor(private dataService: RuskdataService,
    private picdocService: PicdocService,
    private goesToService: GoesToService,
    // private itemseenService: ItemseenService,
    private cd: ChangeDetectorRef,
    private router: Router,
    private userService: UserService) {
      // ctor body
      this.picDocs = this.picdocService.getPicDocs();

  }

  ngOnInit() {
    this.user$ = this.userService.user$;
    this.userProfile$ = this.userService.profile$;

    this.subs.push(this.userService.user$.subscribe(user => {
        console.log('Home Page subscription yields user: ', user, user?.getIdToken())

      })
    )
  }

  ngOnDestroy(): void {
      this.subs.forEach(sub => sub.unsubscribe);
  }

  openPic(picdoc: PicDoc){
      console.log('HomePage openPic', picdoc)
  }

  addPic() {
      this.picdocService.getPicDocById('test')
        .subscribe(localPicDoc =>
          this.picdocService.addPicDoc(localPicDoc)
    );
  }

  initGT(){
    this.goesToService.initTestGT();
  }
  openItemseen(itemseen) {

  }

  async logout() {
    await this.userService.logout();
    this.router.navigateByUrl('/');
  }
}
