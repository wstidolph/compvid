import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { IonicModule } from '@ionic/angular';
import { ReactiveFormsModule } from '@angular/forms'
import { RuskdataModule  } from '@compvid/xplat/ionic/features'

import { MainpicsPageRoutingModule } from './picture-routing.module';

import { PicturePage } from './picture.page';

// ionic-ruskinv
@NgModule({
  imports: [
    CommonModule,
    ReactiveFormsModule,
    IonicModule,
    RuskdataModule,
    MainpicsPageRoutingModule
  ],
  declarations: [PicturePage]
})
export class PicturePageModule {}
