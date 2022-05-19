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
  CollectionReference,
  where,
  query,
  Timestamp,
} from '@angular/fire/firestore';

import { Observable, forkJoin, BehaviorSubject } from 'rxjs';

export interface PlaceDoc {
  id?: string;
  value: number,
  label: string;
  desc?: string;
  parentPlaceId?: string;
}

const COLLECTION = 'places';

@Injectable({
  providedIn: 'root',
})
export class PlacesService {

  private pda = new BehaviorSubject<PlaceDoc[]>([]);
  places$ = this.pda.asObservable();

  constructor(private firestore: Firestore) {

  }

  getPlaceDocs(): Observable<PlaceDoc[]> {
    const picDocCollection = collection(this.firestore, COLLECTION);
    return collectionData(picDocCollection, {idField: 'id'}) as Observable<PlaceDoc[]>;
  }

  getPlaceDocById(id: string) {
    const picDocRef = doc(this.firestore,`${COLLECTION}/${id}`);
    return docData(picDocRef, { idField: 'id'}) as Observable<PlaceDoc>;
  }

  getPlaceDocsByParent(parentId: string) {
    const pdCollection =
      collection(this.firestore, COLLECTION) as  CollectionReference<PlaceDoc>;

    return collectionData<PlaceDoc>(
      query(pdCollection, where('parentPlaceId','==',parentId)),
        {idField: 'id'}
      );
  }

  addPlaceDoc(place: PlaceDoc) {
    const picDocsCollection = collection(this.firestore,  COLLECTION);
    return addDoc(picDocsCollection, place);
  }

  deletePlaceDoc(place: PlaceDoc) {
    const picDocRef = doc(this.firestore,  `${COLLECTION}/${place.id}`);
    return deleteDoc(picDocRef);
  }

  updatePlaceDoc(placeChgs: Partial<PlaceDoc>) {
    const picDocRef = doc(this.firestore,  `${COLLECTION}/${placeChgs.id}`);
    return updateDoc(picDocRef, placeChgs);
  }
}
