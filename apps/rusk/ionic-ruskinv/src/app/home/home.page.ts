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

  addPic(picDoc: PicDoc | null) {
    const testPicDoc: PicDoc = {
        // id: 'foo',
        name: 'some stuff',
        uploadedBy: 'WS',
        mediaUrl: 'https://stidolph.com/kestate/20220305_081749.jpg',
        storageId: 'rusk_'+ new Date().getTime() / 1000
    }

    const localPicDoc = picDoc? picDoc : testPicDoc;
    console.log('HomePage got addPic')
    this.picdocService.addPicDoc(localPicDoc).then((rtn)=> {
      console.log('addPic got back', rtn);
    });

  }

  async logout() {
    await this.authService.logout();
    this.router.navigateByUrl('/');
  }
}
