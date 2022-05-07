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
} from '@angular/fire/firestore';

import {
  getDownloadURL,
  ref,
  Storage, uploadBytes
} from '@angular/fire/storage'

import { Observable, forkJoin, BehaviorSubject } from 'rxjs';

export interface PicDoc {
  id?: string;
  name: string;
  img_name: string;
  uploadedBy?: string; // user ID
  downloadURL?: string;
}

const COLLECTION = 'picdocs';

@Injectable({
  providedIn: 'root',
})
export class PicdocService {
  private pda = new BehaviorSubject<PicDoc[]>([]);
  picdocs$ = this.pda.asObservable();

  constructor(private firestore: Firestore, private storage: Storage) {}

  getPicDocs(): Observable<PicDoc[]> {
    const picDocCollection = collection(this.firestore, COLLECTION);
    return collectionData(picDocCollection, {idField: 'id'}) as Observable<PicDoc[]>;
  }

  getPicDocById(id: string) {
    const picDocRef = doc(this.firestore,`${COLLECTION}/${id}`);
    return docData(picDocRef, { idField: 'id'}) as Observable<PicDoc>;
  }

  getPicDocsByImgName(iname: string) {
    const pdCollection =
      collection(this.firestore, COLLECTION) as  CollectionReference<PicDoc>;

    return collectionData<PicDoc>(
      query(pdCollection, where('img_name','==',iname)),
        {idField: 'id'}
      );
  }

  addPicDoc(picdoc: PicDoc) {
    const picDocsCollection = collection(this.firestore,  COLLECTION);
    return addDoc(picDocsCollection, picdoc);
  }

  deletePicDoc(picdoc: PicDoc) {
    const picDocRef = doc(this.firestore,  `${COLLECTION}/${picdoc.id}`);
    return deleteDoc(picDocRef);
  }

  updatePicDoc(picdocChgs: Partial<PicDoc>) { //TODO fix passing data
    const picDocRef = doc(this.firestore,  `${COLLECTION}/${picdocChgs.id}`);
    return updateDoc(picDocRef, picdocChgs);
  }

  async uploadImage(img: Blob, picdoc: PicDoc){
    const path = `images`
    const storageRef = ref(this.storage, path);
    try {
      await uploadBytes(storageRef, img);
      const downloadURL = await getDownloadURL(storageRef);
      const pdRef = doc(this.firestore, `COLLECTION/${picdoc.id}`)
      await updateDoc(pdRef, {downloadURL});
      return true;
    } catch (e) {
        console.log(e);
        return null;
    }
  }
}
