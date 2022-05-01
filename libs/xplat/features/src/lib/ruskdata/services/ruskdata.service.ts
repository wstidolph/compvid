import { Injectable } from '@angular/core';

import { Firestore, collection, collectionData, doc, docData, addDoc, deleteDoc, updateDoc } from '@angular/fire/firestore';
import { getBytes, getDownloadURL, ref, Storage, getStorage, listAll } from '@angular/fire/storage';

import { Observable, of} from 'rxjs';

export interface PicDoc {
  id: string;
  name: string;
  uploadedBy: string; // user ID
  downloadUrl?: string;
  desc?: string; // principle object(s)
  text?: string;
}

@Injectable({
  providedIn: 'root',
})
export class RuskdataService {

  constructor(private firestore: Firestore, private storage: Storage) {
  }
  getPicDocs(): Observable<PicDoc[]> {
    const notesRef = collection(this.firestore, 'picdocs');
    return collectionData(notesRef, { idField: 'id'}) as Observable<PicDoc[]>;
  }

  getPicDocById(id): Observable<PicDoc> {
    const picDocRef = doc(this.firestore, `picdocs/${id}`);
    return docData(picDocRef, { idField: 'id' }) as Observable<PicDoc>;
  }

  addPicDoc(picdoc: PicDoc) {
    const picDocRef = collection(this.firestore, 'picdocs');
    return addDoc(picDocRef, picdoc);
  }

  deletePicDoc(picdoc: PicDoc) {
    const picDocRef = doc(this.firestore, `picdocs/${picdoc.id}`);
    return deleteDoc(picDocRef);
  }

  updatePicDoc(picdoc: PicDoc) {
    const picDocRef = doc(this.firestore, `picdocs/${picdoc.id}`);
    return updateDoc(picDocRef, { name: picdoc.name, text: picdoc.text });
  }

  getImageListInPicDocs() {
    const pds: PicDoc[] = [];
    const storage = getStorage();
    const listRef = ref(storage, '');
    listAll(listRef).then((res) => {
      res.items.forEach( (itemRef) => {
        getDownloadURL(itemRef).then( (url) => {
          const pd: PicDoc = {
            id:itemRef.fullPath,
            uploadedBy: 'WS',
            name: itemRef.name,
            downloadUrl: url
          };
          pds.push(pd);
        })
      })
    });
    return pds;
  }
}

