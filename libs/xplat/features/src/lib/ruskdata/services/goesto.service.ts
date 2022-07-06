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

import { Observable, BehaviorSubject, map, tap } from 'rxjs';
import { GoesTo } from '../models';


const COLLECTION = 'goesTo';

@Injectable({
  providedIn: 'root',
})
export class GoesToService {

  constructor(private firestore: Firestore) {
    //console.log('goesto service see firestore with options', firestore, firestore.app.options);
  }

  // initTestGT() {
  //   TEST_GTOPTIONS_ARRAY.forEach(gto => {
  //     this.addGoesTo(gto)
  //   })
  // }

  getGoesTos(): Observable<GoesTo[]> {
    const goesToCollection = collection(this.firestore, COLLECTION);
    return collectionData(goesToCollection, {idField: 'id'}) as Observable<GoesTo[]>;
  }

  // getGoesToAsOptions(): Observable<GoesToOption[]> {
  //   return this.getGoesTos().pipe(
  //     map(gta=>gta.map(gt => {
  //       return {label: gt.toFullname? gt.toFullname : gt.to,
  //               value: gt.toId,
  //               id: gt.id} as GoesToOption
  //       }
  //     ))
  // )}

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
