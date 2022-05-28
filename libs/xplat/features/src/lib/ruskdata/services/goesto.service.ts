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

import { Observable, BehaviorSubject, map } from 'rxjs';
import { GoesTo } from '../models';

export interface GoesToOption {
  id?: string;
  value: string;
  label: string;
}
const TEST_GTOPTIONS_ARRAY = [
  {
    to: 'WS',
    fullname: 'Wayne Stidolph',
    accordingTo: 'WS'
  },
  {
    to: 'DS',
    fullname: 'Donna Stidolph',
    accordingTo: 'WS'
  },
  {
    to: 'CS',
    fullname: 'Cap Stidolph',
    accordingTo: 'DS'
  },
  {
    to: 'WS2',
    fullname: 'Wayne Stidolph',
    accordingTo: 'WS'
  },
  {
    to: 'WS3',
    fullname: 'Wayne Stidolph',
    accordingTo: 'CS'
  }
]
const COLLECTION = 'goesTo';

@Injectable({
  providedIn: 'root',
})
export class GoesToService {

  constructor(private firestore: Firestore) {
    //console.log('goesto service see firestore with options', firestore, firestore.app.options);
  }

  initTestGT() {
    TEST_GTOPTIONS_ARRAY.forEach(gto => {
      this.addGoesTo(gto)
    })
  }

  getGoesTos(): Observable<GoesTo[]> {
    const goesToCollection = collection(this.firestore, COLLECTION);
    return collectionData(goesToCollection, {idField: 'id'}) as Observable<GoesTo[]>;
  }

  getGoesToAsOptions(): Observable<GoesToOption[]> {
    return this.getGoesTos().pipe(
      map(gta=>gta.map(gt => {
        return {label: gt.fullnameTo? gt.fullnameTo : gt.to,
                value: gt.to,
                id: gt.id} as GoesToOption
        }
      ))
  )}

  getGoesToById(id: string) {
    const poDocRef = doc(this.firestore,`${COLLECTION}/${id}`);
    return docData(poDocRef, { idField: 'id'}) as Observable<GoesTo>;
  }

  addGoesTo(goesTo: GoesTo) {
    const goesToCollection = collection(this.firestore,  COLLECTION);
    return addDoc(goesToCollection, goesTo);
  }

  deleteGoesTo(goesTo: GoesTo) {
    const goesToDocRef = doc(this.firestore,  `${COLLECTION}/${goesTo.id}`);
    return deleteDoc(goesToDocRef);
  }

  updateGoesTo(goesToChgs: Partial<GoesTo>) {
    const goesToDocRef = doc(this.firestore,  `${COLLECTION}/${goesToChgs.id}`);
    return updateDoc(goesToDocRef, goesToChgs);
  }
}
