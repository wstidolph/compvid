import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { IonicModule } from '@ionic/angular';
import { ReactiveFormsModule } from '@angular/forms'
import { RuskdataModule  } from '@compvid/xplat/ionic/features'

import { SwiperModule } from 'swiper/angular';

import { PiclistPageRoutingModule } from './piclist-routing.module';

import { PiclistPage } from './piclist.page';

// ionic-ruskinv
@NgModule({
  imports: [
    CommonModule,
    ReactiveFormsModule,
    IonicModule,
    SwiperModule,
    RuskdataModule,
    PiclistPageRoutingModule
  ],
  declarations: [PiclistPage]
})
export class PiclistPageModule {}
