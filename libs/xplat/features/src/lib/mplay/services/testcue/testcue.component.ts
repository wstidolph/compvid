import { Component, OnInit } from '@angular/core';
import { CuemgrService } from '../cuemgr.service';

@Component({
  selector: 'compvid-testcue',
  templateUrl: './testcue.component.html',
  styleUrls: ['./testcue.component.css']
})
export class TestcueComponent {

  constructor(public cuemgrSvc: CuemgrService) { }

}
