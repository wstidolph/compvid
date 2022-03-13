import { NgModule } from '@angular/core';

import { CoreModule } from './core/core.module';
import { SharedModule } from './features/shared/shared.module';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

import { environment } from '../environments/environment';
import { provideAuth, connectAuthEmulator, getAuth } from '@angular/fire/auth';
import { provideFirebaseApp, getApp, initializeApp } from '@angular/fire/app';
import { getFirestore, provideFirestore } from '@angular/fire/firestore';

//import { TestcueComponent } from '../../../../libs/xplat/features/src/lib/mplay/services/testcue/testcue.component';

@NgModule({
  imports: [CoreModule, SharedModule, AppRoutingModule,
    provideFirebaseApp(() => initializeApp(environment.firebaseConfig)),
    provideFirestore(() => getFirestore()),
    provideAuth(() => {
      const auth = getAuth();
      if (environment.useEmulators) {
        connectAuthEmulator(auth, 'http://localhost:9099', { disableWarnings: true });
      }
      return auth;
    })],
  declarations: [AppComponent],
  bootstrap: [AppComponent],
})
export class AppModule {}
