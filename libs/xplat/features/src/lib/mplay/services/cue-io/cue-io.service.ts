import { Injectable } from '@angular/core';
import { Firestore, collection, collectionData, doc, docData, addDoc, deleteDoc, updateDoc } from '@angular/fire/firestore';
import { Observable } from 'rxjs';

export interface CueDoc {
  startTime: number,
  endTime: number,
  id: string,
  description? : string,
  playrate? : number
}
/**
 * Transport CueDocs between the app and Firestore
 */
@Injectable({
  providedIn: 'root'
})
export class CueIOService {

  constructor(private firestore: Firestore) { }

  getCueDocs(mediaId: string, userId: string) : Observable<CueDoc[]>{
    const cueDocRef = collection(this.firestore, 'cues');
    return collectionData(cueDocRef, {idField: 'id'}) as Observable<CueDoc[]>;
  }
}
