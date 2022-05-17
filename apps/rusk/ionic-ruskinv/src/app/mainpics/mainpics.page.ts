import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { Timestamp } from '@angular/fire/firestore';
import { FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService, PicDoc, PicdocService } from '@compvid/xplat/features';
import { FormlyFieldConfig } from '@ngx-formly/core';
import { Observable, Subscription } from 'rxjs';

@Component({
  selector: 'compvid-mainpics',
  templateUrl: './mainpics.page.html',
  styleUrls: ['./mainpics.page.scss'],
})
export class MainpicsPage implements OnInit {

  picDocs: Observable<PicDoc[]>;

  subs: Subscription[] = [];

  form = new FormGroup({});
  model = { email: 'email@gmail.com' };
  fields: FormlyFieldConfig[] = [
    {
      key: 'email',
      type: 'input',
      templateOptions: {
        label: 'Email address',
        placeholder: 'Enter email',
        required: true,
      }
    }
  ];

  onSubmit(model) {
    console.log(model);
  }
  constructor(    private picdocService: PicdocService,
    private cd: ChangeDetectorRef,
    private router: Router,
    private authService: AuthService) {

    this.picDocs = this.picdocService.getPicDocs();
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

  openPic($evt){
    console.log('mainpage for openPic', $evt);
  }

  ngOnInit() {
    this.subs.push(this.picDocs.subscribe(pd => {
      console.log('mainpage got', pd);
    }));
  }

  ngOnDestry() {
    this.subs.forEach(sub => sub.unsubscribe());
  }
}
