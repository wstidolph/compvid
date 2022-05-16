import { Component, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { FormlyFieldConfig } from '@ngx-formly/core';

@Component({
  selector: 'compvid-mainpics',
  templateUrl: './mainpics.page.html',
  styleUrls: ['./mainpics.page.scss'],
})
export class MainpicsPage implements OnInit {

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
  constructor() { }

  ngOnInit() {
  }

}
