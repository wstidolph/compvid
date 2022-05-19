import { NgModule } from '@angular/core';
import { DatapicModule as SharedDatapicModule } from '@compvid/xplat/features';
import { UIModule } from '../ui/ui.module';
import { DATAPIC_COMPONENTS } from './components';

import { ReactiveFormsModule } from '@angular/forms';
import { FormlyModule } from '@ngx-formly/core';
import { FormlyIonicModule} from '@ngx-formly/ionic';
import { RepeatItemSeenComponent } from './components';

@NgModule({
  imports: [SharedDatapicModule, UIModule,
  FormlyModule.forChild({
    types: [{ name: 'repeat', component: RepeatItemSeenComponent }],
    validationMessages: [{ name: 'required', message: 'This field is required' }],
  }),
  FormlyIonicModule],
  declarations: [...DATAPIC_COMPONENTS],
  exports: [...DATAPIC_COMPONENTS],
})
export class DatapicModule {}
