import { Component } from '@angular/core';

import { BaseComponent } from '@compvid/xplat/core';
import { PicDoc, ItemSeen, ItemseenService } from '@compvid/xplat/features';
import { FormGroup } from '@angular/forms';
import { FormlyFormOptions, FormlyFieldConfig, FormlyField, FieldArrayType } from '@ngx-formly/core';
import { Observable, of } from 'rxjs';

@Component({
  selector: 'dpis-repeat-section',
  template: `
    <div class="mb-3">
      <legend *ngIf="to.props.label">{{ to.props.label }}</legend>
      <p *ngIf="to.props.description">{{ to.props.description }}</p>

      <div *ngFor="let field of field.fieldGroup; let i = index" class="row align-items-baseline">
        <formly-field class="col" [field]="field"></formly-field>
        <div class="col-1 d-flex align-items-center">
          <button class="btn btn-danger" type="button" (click)="remove(i)">-</button>
        </div>
      </div>
      <div style="margin:30px 0;">
        <button class="btn btn-primary" type="button" (click)="add()">{{ to.props.addText }}</button>
      </div>
    </div>
  `,
})
export class RepeatItemSeenComponent extends FieldArrayType {}
