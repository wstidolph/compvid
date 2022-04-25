import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { MainpicsPage } from './mainpics.page';

const routes: Routes = [
  {
    path: '',
    component: MainpicsPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class MainpicsPageRoutingModule {}
