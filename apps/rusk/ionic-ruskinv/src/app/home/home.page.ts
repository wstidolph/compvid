import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { RuskdataService, PicDoc, PicdocService, AuthService } from '@compvid/xplat/features';
import { from, Observable } from 'rxjs'

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage implements OnInit {
  picDocs: Observable<PicDoc[]>;

  constructor(private dataService: RuskdataService,
    private picdocService: PicdocService,
    private cd: ChangeDetectorRef,
    private router: Router,
    private authService: AuthService) {

  }

  ngOnInit() {
    this.picDocs = this.picdocService.getPicDocs();
  }

  openPic(picdoc: PicDoc){
      console.log('HomePage openPic', picdoc)
  }

  addPic(picDoc: PicDoc) {
    const testPicDoc: PicDoc = {
        id: 'foo',
        name: 'wayne test',
        uploadedBy: 'WS',
        mediaUrl: 'https://stidolph.com/kestate/20220305_081558.jpg',
        storageId: 'test_img',
    }

    console.log('HomePage got addPic')
    this.picdocService.addPicDoc(testPicDoc).then((rtn)=> {
      console.log('addPic got back', rtn);
    });

  }

  async logout() {
    await this.authService.logout();
    this.router.navigateByUrl('/');
  }
}
