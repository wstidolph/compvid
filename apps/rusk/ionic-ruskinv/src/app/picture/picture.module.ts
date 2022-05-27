import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { IonicModule } from '@ionic/angular';
import { ReactiveFormsModule } from '@angular/forms'
import { RuskdataModule  } from '@compvid/xplat/ionic/features'

import { SwiperModule } from 'swiper/angular';

import { PicturePageRoutingModule } from './picture-routing.module';

import { PicturePage } from './picture.page';

// ionic-ruskinv
@NgModule({
  imports: [
    CommonModule,
    ReactiveFormsModule,
    IonicModule,
    SwiperModule,
    RuskdataModule,
    PicturePageRoutingModule
  ],
  declarations: [PicturePage]
})
export class PicturePageModule {}
