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

// import {AngularFirestore} from '@angular/fire/compat/firestore';
import { Observable, BehaviorSubject } from 'rxjs';

// describe the things in the picture
export interface ItemSeen {
  id?: string;
  inpicdoc: string; // item is seen in (join key)
  desc: string;     // description of the Item
  goesTo: string;   // disposition target
  note:string;      // commentary/justification
  author: string;   // of the description
}

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

  updateItemSeen(itemseen: ItemSeen) { //TODO fix passing data
    const itemseenRefRef = doc(this.firestore, `${COLLECTION}/${itemseen.id}`);
    return updateDoc(itemseenRefRef, {} );
  }
}
