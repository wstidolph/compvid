import { NgModule, NO_ERRORS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';

import { IonicModule } from '@ionic/angular';
import { ReactiveFormsModule } from '@angular/forms'
import { RuskdataModule  } from '@compvid/xplat/ionic/features'

import { SwiperModule } from 'swiper/angular';
import { TwicPicsComponentsModule } from '@twicpics/components/angular13'
import { DomchangeDirective } from './domchange.directive';
import { ResizeObserverDirective } from './resizeObserver.directive';

import { PicturePageRoutingModule } from './picture-routing.module';

import { PicturePage } from './picture.page';

// 'NO_ERRORS_SCHEMA' to the '@NgModule.schemas'
// ionic-ruskinv
@NgModule({
  imports: [
    CommonModule,
    ReactiveFormsModule,
    IonicModule,
    SwiperModule,
    TwicPicsComponentsModule,
    RuskdataModule,
    PicturePageRoutingModule
  ],
  schemas: [NO_ERRORS_SCHEMA],
  declarations: [PicturePage, DomchangeDirective, ResizeObserverDirective]
})
export class PicturePageModule {}
