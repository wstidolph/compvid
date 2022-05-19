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
  Timestamp,
  CollectionReference,
  query,
  where,
} from '@angular/fire/firestore';

import { Observable, BehaviorSubject } from 'rxjs';

// describe the things in the picture
export interface ItemSeen {
  id?: string;
  inpicdoc: string; // item is seen in (join key)
  desc?: string;     // description of the Item
  goesTo?: string;   // disposition target
  note?:string;      // commentary/justification
  author: string;   // of the description
  editDate?: Timestamp;
}

const COLLECTION = 'itemseens';

@Injectable({
  providedIn: 'root',
})
export class ItemseenService {
  private itemseens = new BehaviorSubject<ItemSeen[]>([]);
  itemseens$ = this.itemseens.asObservable();

  constructor(private firestore: Firestore) {}

  getItemSeens(): Observable<ItemSeen[]> {
    const itsc = collection(this.firestore, COLLECTION);
    return collectionData(itsc, { idField: 'id' }) as Observable<ItemSeen[]>;
  }

  getItemSeenById(id: string): Observable<ItemSeen> {
    const itemseenRefRef = doc(this.firestore, `${COLLECTION}/${id}`);
    return docData(itemseenRefRef, { idField: 'id' }) as Observable<ItemSeen>;
  }

  getItemSeensByPicdoc(pdId: string) {
    const itemseensCollection =
      collection(this.firestore, COLLECTION) as  CollectionReference<ItemSeen>;

    return collectionData<ItemSeen>(
      query(itemseensCollection, where('inpicdoc','==',pdId)),
        {idField: 'id'}
      );
  }

  addItemSeen(itemseen: ItemSeen) {
    const itemseenRefRef = collection(this.firestore, COLLECTION);
    return addDoc(itemseenRefRef, itemseen);
  }

  deleteItemSeen(itemseen: ItemSeen) {
    const itemseenRefRef = doc(this.firestore, `${COLLECTION}/${itemseen.id}`);
    return deleteDoc(itemseenRefRef);
  }

  updateItemSeen(itemseenChgs: Partial<ItemSeen>) { //TODO fix passing data
    const itemseenRefRef = doc(this.firestore, `${COLLECTION}/${itemseenChgs.id}`);
    return updateDoc(itemseenRefRef, {} );
  }
}
