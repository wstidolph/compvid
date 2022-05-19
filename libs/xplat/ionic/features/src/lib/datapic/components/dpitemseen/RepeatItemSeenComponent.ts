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
      <ion-label *ngIf="to.props.label">{{ to.props.label }}</ion-label>
      <ion-button (click)="add()">Add</ion-button>
      <p *ngIf="to.props.description">{{ to.props.description }}</p>
      <ion-list>
        <ion-item-sliding *ngFor="let field of field.fieldGroup; let i = index">
          <ion-item-options side="end">

            <ion-item-option color="danger" expandable (click)="remove(i)">
                Delete
            </ion-item-option>
          </ion-item-options>

          <ion-item  class="row align-items-baseline">
            <formly-field class="col" [field]="field"></formly-field>
            <!-- <div class="col-1 d-flex align-items-center">
              <button class="btn btn-danger" type="button" (click)="remove(i)">-</button>
            </div> -->
          </ion-item>
        </ion-item-sliding>
      </ion-list>

    </div>
  `,
})
export class RepeatItemSeenComponent extends FieldArrayType {}
