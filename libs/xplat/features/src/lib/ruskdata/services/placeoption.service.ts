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
import { Place } from '../models';

export interface PlaceOption {
  id?: string;
  parent?: string;
  value: string;
  label: string;
}

const COLLECTION = 'placeoptions';

@Injectable({
  providedIn: 'root',
})
export class PlaceOptionsService {
  private pda = new BehaviorSubject<PlaceOption[]>([]);
  placeOptions$ = this.pda.asObservable();

  constructor(private firestore: Firestore) {
    //console.log('place options service see firestore with options', firestore, firestore.app.options);
  }

  getPlaceOptions(): Observable<PlaceOption[]> {
    const poDocCollection = collection(this.firestore, COLLECTION);
    return collectionData(poDocCollection, {idField: 'id'}) as Observable<PlaceOption[]>;
  }

  getPlaceOptionById(id: string) {
    const poDocRef = doc(this.firestore,`${COLLECTION}/${id}`);
    return docData(poDocRef, { idField: 'id'}) as Observable<PlaceOption>;
  }

  addPlaceOption(place: PlaceOption) {
    const poDocsCollection = collection(this.firestore,  COLLECTION);
    return addDoc(poDocsCollection, place);
  }

  deletePlaceOption(place: PlaceOption) {
    const poDocRef = doc(this.firestore,  `${COLLECTION}/${place.id}`);
    return deleteDoc(poDocRef);
  }

  updatePlaceOption(placeOptionChgs: Partial<PlaceOption>) {
    const poDocRef = doc(this.firestore,  `${COLLECTION}/${placeOptionChgs.id}`);
    return updateDoc(poDocRef, placeOptionChgs);
  }
}
