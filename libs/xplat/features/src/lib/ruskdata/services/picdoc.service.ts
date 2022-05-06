import { Injectable } from '@angular/core';

import {
  Firestore,
  collection,
  collectionData,
  doc,
  docData,
  addDoc,
  deleteDoc,
  updateDoc,
} from '@angular/fire/firestore';
import { Observable, forkJoin, BehaviorSubject } from 'rxjs';

export interface PicDoc {
  id?: string;
  name: string;
  uploadedBy?: string; // user ID
  downloadUrl?: string;
}

const COLLECTION = 'picdocs';

@Injectable({
  providedIn: 'root',
})
export class PicdocService {
  private pda = new BehaviorSubject<PicDoc[]>([]);
  picdocs$ = this.pda.asObservable();

  constructor(private firestore: Firestore) {}
  getPicDocs(): Observable<PicDoc[]> {
    const notesRef = collection(this.firestore, COLLECTION);
    return collectionData(notesRef, { idField: 'id' }) as Observable<PicDoc[]>;
  }

  getPicDocById(id: string): Observable<PicDoc> {
    const picDocRef = doc(this.firestore, `${COLLECTION}/${id}`);
    return docData(picDocRef, { idField: 'id' }) as Observable<PicDoc>;
  }

  addPicDoc(picdoc: PicDoc) {
    const picDocRef = collection(this.firestore, COLLECTION);
    return addDoc(picDocRef, picdoc);
  }

  deletePicDoc(picdoc: PicDoc) {
    const picDocRef = doc(this.firestore, `${COLLECTION}/${picdoc.id}`);
    return deleteDoc(picDocRef);
  }

  updatePicDoc(picdoc: PicDoc) { //TODO fix passing data
    const picDocRef = doc(this.firestore, `${COLLECTION}/${picdoc.id}`);
    return updateDoc(picDocRef, { name: picdoc.name });
  }
}
