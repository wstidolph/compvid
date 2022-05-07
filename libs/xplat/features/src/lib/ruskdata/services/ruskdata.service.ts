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


import {
  getBytes,
  getDownloadURL,
  ref,
  Storage,
  getStorage,
  listAll,
  ListResult,
} from '@angular/fire/storage';

import { Observable, forkJoin, pipe, BehaviorSubject } from 'rxjs';

import { PicDoc, PicdocService } from './picdoc.service';
import { ItemSeen, ItemseenService} from './itemseen.service';


// this service exposes the ModelViews
export interface PicDocWithItemsSeen {
  pd: PicDoc,
  itemseens: ItemSeen[]
}

@Injectable({
  providedIn: 'root',
})
export class RuskdataService {

  constructor(private firestore: Firestore,
    private storage: Storage,
    private pds: PicdocService,
    private iss: ItemseenService) {}


  private pdWithItemSeen = new BehaviorSubject<PicDocWithItemsSeen[]>([]);
  picdocsWithItemSeens$ = this.pdWithItemSeen.asObservable();

}


