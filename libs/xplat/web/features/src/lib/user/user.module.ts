import { NgModule } from '@angular/core';
import { UserModule as SharedUserModule } from '@compvid/xplat/features';
import { UIModule } from '../ui/ui.module';
import { USER_COMPONENTS } from './components';

@NgModule({
  imports: [SharedUserModule, UIModule],
  declarations: [...USER_COMPONENTS],
  exports: [...USER_COMPONENTS],
})
export class UserModule {}
