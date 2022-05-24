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

const COLLECTION = 'goesTo';

@Injectable({
  providedIn: 'root',
})
export class GoesToService {

  constructor(private firestore: Firestore) {
    console.log('place options service see firestore with options', firestore, firestore.app.options);
  }

  getGoesTos(): Observable<GoesTo[]> {
    const goesToCollection = collection(this.firestore, COLLECTION);
    return collectionData(goesToCollection, {idField: 'id'}) as Observable<GoesTo[]>;
  }

  getGoesToAsOptions(): Observable<GoesToOption[]> {
    return this.getGoesTos().pipe(
      map(gta=>gta.map(gt => {
        return {'label': gt.fullnameTo? gt.fullnameTo : gt.to, value: gt.to} as GoesToOption
        }
      ))
  )}

  getGoesToById(id: string) {
    const poDocRef = doc(this.firestore,`${COLLECTION}/${id}`);
    return docData(poDocRef, { idField: 'id'}) as Observable<GoesTo>;
  }

  addGoesTo(place: GoesTo) {
    const goesToCollection = collection(this.firestore,  COLLECTION);
    return addDoc(goesToCollection, place);
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
