import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { RuskdataService, PicDoc } from '@compvid/xplat/features';
import { from, Observable } from 'rxjs'

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage implements OnInit {
  picDocs: Observable<PicDoc[]>;

  constructor(private dataService: RuskdataService, private cd: ChangeDetectorRef) {
    this.picDocs = this.dataService.getPicDocs();
  }

  ngOnInit() {
  }

  openPic(picdoc: PicDoc){
      console.log('HomePage openPic', picdoc)
  }

  addPic() {
    const testPicDoc: PicDoc = {
        id: 'foo',
        name: 'wayne test',
        uploadedBy: 'WS'
    }

    console.log('HomePage got addPic')
    this.dataService.addPicDoc(testPicDoc);
  }
}
