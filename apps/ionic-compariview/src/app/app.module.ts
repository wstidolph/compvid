import { NgModule } from '@angular/core';

import { CoreModule } from './core/core.module';
import { SharedModule } from './features/shared/shared.module';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
//import { TestcueComponent } from '../../../../libs/xplat/features/src/lib/mplay/services/testcue/testcue.component';

@NgModule({
  imports: [CoreModule, SharedModule, AppRoutingModule],
  declarations: [AppComponent],
  bootstrap: [AppComponent],
})
export class AppModule {}
