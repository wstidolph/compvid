import { Injectable } from '@angular/core';
import { Firestore, collection, collectionData, doc, docData, addDoc, deleteDoc, updateDoc } from '@angular/fire/firestore';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { ICuePoint } from '../../models';

export interface CueDoc {
  startTime: number,
  endTime: number,
  id: string,
  description? : string,
  playrate? : number
}

type usermediacues = {
  [uid: string] : { [mid:string] : ICuePoint[]}
}

/**
 * Transport CueDocs between the app and Firestore
 */
@Injectable({
  providedIn: 'root'
})
export class CueIOService {

  constructor(
    //private firestore: Firestore
    ) { }
    getUsersCuesForMedia(uid: string, mid: string): Observable<CueDoc[]> {
      // if(!(uid in this.umc){
      //   console.log('CuemgrService #getUsersCuesForMedia got unknown UID', uid);
      //   return of([]);
      // }

      // if(!(mid in usersMediaCues){
      //   console.log('CuemgrService #getUsersCuesForMedia got unknown MID ' + mid + ' for UID ' + uid);
      //   return of([]);
      // }
      // const cues =
      return of([]);
    }

  getCueDocs(mediaId: string, userId: string) : Observable<CueDoc[]>{
    //   const cueDocRef = collection(this.firestore, 'cues');
    //   return collectionData(cueDocRef, {idField: 'id'}) as Observable<CueDoc[]>;
    return new BehaviorSubject<CueDoc[]>([]).asObservable();
  }
}
