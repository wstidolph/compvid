import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { RuskdataService, PicDoc, PicdocService, AuthService, GoesToService,
        //ItemseenService, ItemSeen
        } from '@compvid/xplat/features';
import { from, Observable } from 'rxjs'

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage implements OnInit {
  picDocs: Observable<PicDoc[]>;
  // itemseens: Observable<ItemSeen[]>;

  constructor(private dataService: RuskdataService,
    private picdocService: PicdocService,
    private goesToService: GoesToService,
    // private itemseenService: ItemseenService,
    private cd: ChangeDetectorRef,
    private router: Router,
    private authService: AuthService) {

      this.picDocs = this.picdocService.getPicDocs();
      // this.itemseens = this.itemseenService.getItemSeens();

      // this.picDocs.subscribe(pd => {
      //   console.log('HomePage got pd', pd);
      // })

  }

  ngOnInit() {
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
    await this.authService.logout();
    this.router.navigateByUrl('/');
  }
}
