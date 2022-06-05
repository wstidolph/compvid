import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms';


import { IonicModule, IonicRouteStrategy } from '@ionic/angular';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';

import { environment } from '../environments/environment';
import { getAuth, provideAuth, connectAuthEmulator  } from '@angular/fire/auth'
import { provideFirebaseApp, initializeApp } from '@angular/fire/app';
import { getFirestore, provideFirestore, connectFirestoreEmulator } from '@angular/fire/firestore';
import { getStorage, provideStorage, connectStorageEmulator } from '@angular/fire/storage';
import { getFunctions, provideFunctions, connectFunctionsEmulator } from '@angular/fire/functions';

import { ImagekitioAngularModule } from 'imagekitio-angular'
import { TwicPicsComponentsModule } from "@twicpics/components/angular13"

@NgModule({
  declarations: [AppComponent],
  entryComponents: [],
  imports: [BrowserModule, IonicModule.forRoot(), AppRoutingModule, ReactiveFormsModule,
    TwicPicsComponentsModule,
    ImagekitioAngularModule.forRoot({
      publicKey: environment.imagekit.publicKey,
      urlEndpoint: environment.imagekit.urlEndpoint,
      authenticationEndpoint: environment.imagekit.authenticationEndpoint,
    }),
    // AngularFirestoreModule,
    provideFirebaseApp(() => initializeApp(environment.firebase)),
    provideAuth(()=> {
      const auth = getAuth();
      connectAuthEmulator(auth, 'http://localhost:9099', {disableWarnings: true});
      return auth;
    }),
    provideFirestore(() => {
      const firestore = getFirestore();
      connectFirestoreEmulator(firestore, 'localhost', 8080);
      return firestore;
    }),
    provideFunctions(() => {
      const functions = getFunctions();
      connectFunctionsEmulator(functions, 'localhost', 5001);
      return functions;
    }),
    provideStorage(() => {
      const storage = getStorage()
      connectStorageEmulator(storage, 'localhost', 9199);
      return storage;
    })
  ],
  providers: [{ provide: RouteReuseStrategy, useClass: IonicRouteStrategy }
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
