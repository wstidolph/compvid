import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';
import { RuskdataModule } from '@compvid/xplat/ionic/features'

import { MainpicsPageRoutingModule } from './mainpics-routing.module';

import { MainpicsPage } from './mainpics.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RuskdataModule,
    MainpicsPageRoutingModule
  ],
  declarations: [MainpicsPage]
})
export class MainpicsPageModule {}
