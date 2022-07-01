import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {PicdocResolverService } from '@compvid/xplat/features'
import { PicturePage } from './picture.page';
import { CanDeactivateGuard } from '../../../../../../libs/xplat/ionic/features/src/lib/ruskdata/components';

const routes: Routes = [
  {
    path: '',
    component: PicturePage,
    canDeactivate: [CanDeactivateGuard]
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
  providers: [CanDeactivateGuard]
})
export class PicturePageRoutingModule {}
