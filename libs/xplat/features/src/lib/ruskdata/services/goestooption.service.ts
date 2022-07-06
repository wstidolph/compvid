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
import { GoesToOption } from '../models';

/**
 * GoesToOptionOption are targets for disposition (the GoesTo selector, reports, etc)
 */
const TEST_GTOPTIONS_ARRAY: GoesToOption[] = [
  {
    shortName: 'Ferd',
    fullName: 'Ferdinand',
    uid: 'edclcdC6Z6wS0y5UMW8iNg94JVtA',
    categories: []
  },
  {
    shortName: 'F2',
    fullName: 'Ferdinand 2',
    uid: 'edclcdC6Z6wS0y5UMW8iNg94JVtA',
    categories: ['Furniture']
  },
  {
    shortName: 'F3',
    fullName: 'Ferdinand 3',
    uid: 'edclcdC6Z6wS0y5UMW8iNg94JVtA',
    categories: ['Furniture', 'Jewelry']
  },
]
const COLLECTION = 'goesToOption';

@Injectable({
  providedIn: 'root',
})
export class GoesToOptionService {

  constructor(private firestore: Firestore) {
    //console.log('GoesToOption service see firestore with options', firestore, firestore.app.options);
  }

  initTestGT() {
    TEST_GTOPTIONS_ARRAY.forEach(gto => {
      this.addGoesToOption(gto)
    })
  }

  getGoesToOptions(): Observable<GoesToOption[]> {
    const GoesToOptionCollection = collection(this.firestore, COLLECTION);
    return collectionData(GoesToOptionCollection, {idField: 'id'}) as Observable<GoesToOption[]>;
  }

  getGoesToOptionById(id: string) {
    const poDocRef = doc(this.firestore,`${COLLECTION}/${id}`);
    return docData(poDocRef, { idField: 'id'}) as Observable<GoesToOption>;
  }

  addGoesToOption(GoesToOption: GoesToOption) {
    const GoesToOptionCollection = collection(this.firestore,  COLLECTION);
    return addDoc(GoesToOptionCollection, GoesToOption);
  }

  deleteGoesToOption(GoesToOption: GoesToOption) {
    const GoesToOptionDocRef = doc(this.firestore,  `${COLLECTION}/${GoesToOption.id}`);
    return deleteDoc(GoesToOptionDocRef);
  }

  updateGoesToOption(GoesToOptionChgs: Partial<GoesToOption>) {
    const GoesToOptionDocRef = doc(this.firestore,  `${COLLECTION}/${GoesToOptionChgs.id}`);
    return updateDoc(GoesToOptionDocRef, GoesToOptionChgs);
  }
}
