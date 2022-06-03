import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { NgxCsvParserModule } from 'ngx-csv-parser';

import { MigratePageRoutingModule } from './migrate-routing.module';

import { MigratePage } from './migrate.page';

@NgModule({
  imports: [
    CommonModule,
    ReactiveFormsModule,
    IonicModule,
    NgxCsvParserModule,
    MigratePageRoutingModule
  ],
  declarations: [MigratePage]
})
export class MigratePageModule {}
