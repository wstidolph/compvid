import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { RuskdataService, PicDoc, PicdocService } from '@compvid/xplat/features';
import { from, Observable } from 'rxjs'

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage implements OnInit {
  picDocs: Observable<PicDoc[]>;

  constructor(private dataService: RuskdataService, private picdocService: PicdocService, private cd: ChangeDetectorRef) {

  }

  ngOnInit() {
    this.picDocs = this.picdocService.getPicDocs();
  }

  openPic(picdoc: PicDoc){
      console.log('HomePage openPic', picdoc)
  }

  addPic() {
    const testPicDoc: PicDoc = {
        id: 'foo',
        name: 'wayne test',
        uploadedBy: 'WS',
        mediaUrl: 'https://stidolph.com/kestate/20220305_081558.jpg',
        storageId: 'test_img',
    }

    console.log('HomePage got addPic')

  }
}
