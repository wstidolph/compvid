import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { RuskdataService, PicDoc, PicdocService, AuthService, ItemseenService, ItemSeen } from '@compvid/xplat/features';
import { Timestamp } from 'firebase/firestore';
import { from, Observable } from 'rxjs'

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage implements OnInit {
  picDocs: Observable<PicDoc[]>;
  itemseens: Observable<ItemSeen[]>;

  constructor(private dataService: RuskdataService,
    private picdocService: PicdocService,
    private itemseenService: ItemseenService,
    private cd: ChangeDetectorRef,
    private router: Router,
    private authService: AuthService) {
      this.picDocs = this.picdocService.getPicDocs();
      this.itemseens = this.itemseenService.getItemSeens();
      // this.picDocs.subscribe(pd => {
      //   console.log('HomePage got pd', pd);
      // })

  }

  ngOnInit() {
  }

  openPic(picdoc: PicDoc){
      console.log('HomePage openPic', picdoc)
  }

  addPic(picDoc: PicDoc | null) {
    const testPicDoc: PicDoc = {
        // id: 'foo',
        name: 'some stuff',
        uploadedBy: 'WS',
        mediaUrl: 'https://stidolph.com/kestate/20220305_081749.jpg',
        storageId: 'rusk_'+ new Date().getTime() / 1000,
        editDate: new Timestamp(0,0),
        numItemsseen: 0
    }

    const localPicDoc = picDoc? picDoc : testPicDoc;
    console.log('HomePage addPic sending', localPicDoc);
    this.picdocService.addPicDoc(localPicDoc).then((rtn)=> {
      console.log('addPic got back', rtn);
    });

  }

  openItemseen(itemseen) {

  }

  async logout() {
    await this.authService.logout();
    this.router.navigateByUrl('/');
  }
}
