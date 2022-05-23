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

import { Observable, BehaviorSubject } from 'rxjs';
import { ItemSeen } from '../models';


const COLLECTION = 'itemseens';

@Injectable({
  providedIn: 'root',
})
export class ItemseenService {
  private itemseens = new BehaviorSubject<ItemSeen[]>([]);
  itemseens$ = this.itemseens.asObservable();

  constructor(private firestore: Firestore) {}

  // getItemsSeenByPic(pic: PicDoc){
  //   this.afs.collection(COLLECTION,
  //     q=> q.where('inpicdoc','==', pic.id))
  //     .valueChanges().subscribe(val => console.log(`itemsSeenByPic ${pic}`, val))
  // }

  getItemSeens(): Observable<ItemSeen[]> {
    const itsc = collection(this.firestore, COLLECTION);
    return collectionData(itsc, { idField: 'id' }) as Observable<ItemSeen[]>;
  }

  getItemSeenById(id: string): Observable<ItemSeen> {
    const itemseenRefRef = doc(this.firestore, `${COLLECTION}/${id}`);
    return docData(itemseenRefRef, { idField: 'id' }) as Observable<ItemSeen>;
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
