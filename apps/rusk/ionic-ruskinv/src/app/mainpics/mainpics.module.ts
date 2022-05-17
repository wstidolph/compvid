import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { FormlyModule } from '@ngx-formly/core'
import { FormlyIonicModule } from '@ngx-formly/ionic';

import { IonicModule } from '@ionic/angular';
import { DatapicModule, DatapicComponent } from '@compvid/xplat/ionic/features'

import { MainpicsPageRoutingModule } from './mainpics-routing.module';

import { MainpicsPage } from './mainpics.page';

@NgModule({
  imports: [
    CommonModule,
    ReactiveFormsModule,
    IonicModule,
    FormlyModule.forChild(),
    FormlyIonicModule,
    DatapicModule,
    MainpicsPageRoutingModule
  ],
  declarations: [MainpicsPage]
})
export class MainpicsPageModule {}
