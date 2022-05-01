import { Component, OnInit } from '@angular/core';
import { RuskdataService, PicDoc } from '@compvid/xplat/features';

@Component({
  selector: 'compvid-migrate',
  templateUrl: './migrate.page.html',
  styleUrls: ['./migrate.page.scss'],
})
export class MigratePage implements OnInit {

  picdocs: PicDoc[];
  constructor(private ds: RuskdataService) { }

  ngOnInit() {
    this.picdocs = this.ds.getImageListInPicDocs();
  }

}
