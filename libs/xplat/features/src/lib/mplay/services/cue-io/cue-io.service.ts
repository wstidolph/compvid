import { Injectable } from '@angular/core';
import { Firestore, collection, collectionData, doc, docData, addDoc, deleteDoc, updateDoc } from '@angular/fire/firestore';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { ICue, ICueTrack, IMediaSource } from '../../models';



/**
 * Transport CueDocs between the app and Firestore
 */
@Injectable({
  providedIn: 'root'
})
export class CueIOService {


//  constructor(private firestore: Firestore) { }


      getUsersCuesForMedia(uid: string, mid: string): ICueTrack | null {
       //   const cueDocRef = collection(this.firestore, 'cues');
       //   return collectionData(cueDocRef, {idField: 'id'}) as Observable<CueDoc[]>;
       //   const ucm : ICueTrack;

      return null;
    }

}
