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

import {
  getDownloadURL,
  ref,
  Storage, uploadBytes, UploadMetadata
} from '@angular/fire/storage'
import { ɵNgSelectMultipleOption } from '@angular/forms';

import { Observable, BehaviorSubject, of, map, tap } from 'rxjs';
import { isNullOrUndefined } from 'util';
import { PicDoc } from '../models';
import {convertSnaps } from './db-utils';

// test/dev support
const TEST_PICDOC: PicDoc = {
  id: 'test',
  name: 'some stuff',
  uploadedBy: 'WS',
  externMediaBase: 'https://stidolph.com/kestate/',
  img_basename: '20220305_081749.jpg',
  copyToFirebaseStorage: false,
  downloadURL: 'https://stidolph.com/kestate/20220305_081749.jpg',
  storageId: 'rusk_'+ new Date().getTime() / 1000,
  editDate: Timestamp.fromDate(new Date()),
  isDeleted: false,
  numItemsseen: 0,
  twicFocus: "250x250",
  recipients: [],
  itemsseen: [
    { desc: 'sample item seen',
      addedOn: Timestamp.fromDate(new Date()),
      isDeleted: false,
      twicFocus: "200x200",
      goesTo: {
        to: 'DS',
        accordingTo: 'WS'
      },
    }
  ]
}


const COLLECTION = 'picdocs';

@Injectable({
  providedIn: 'root',
})
export class PicdocService {

  private pda = new BehaviorSubject<PicDoc[]>([]);
  picdocs$ = this.pda.asObservable();

  constructor(private firestore: Firestore, private storage: Storage) {
    // console.log('picdoc service see firestore with options', firestore, firestore.app.options);
;
  }

  getPicDocs(): Observable<PicDoc[]> {
    const picDocCollection = collection(this.firestore, COLLECTION);
    return collectionData(picDocCollection, {idField: 'id'}) as Observable<PicDoc[]>;
  }

  getPicDocById(id: string | null): Observable<PicDoc | null> {
    if(id == 'test'){
      return of(TEST_PICDOC)
    }
    if(!id){
      console.warn('PicdocService getPicDocById got null id');
      return of(null)
    }
    const picDocRef = doc(this.firestore,`${COLLECTION}/${id}`);
    return docData(picDocRef, { idField: 'id'}) as Observable<PicDoc>;
  }

  getPicDocByImgBasename(imgBasename: string | null): Observable<PicDoc | null> {
    const pdCollection =
      collection(this.firestore, COLLECTION, ) as  CollectionReference<PicDoc>;
      return collectionData<PicDoc>(
        query(pdCollection, where('img_basename','==',imgBasename)),
          {idField: 'id'}
        ).pipe(
            // tap(r => console.log('getPicDocByImgBasename ', r)),
            map(results => {
              // const picdocs = convertSnaps<PicDoc>(results);
              return results.length == 1 ? results[0] : null
          })
        )
  }

  // TODO delete?
  getPicDocsByImgName(iname: string) {
    const pdCollection =
      collection(this.firestore, COLLECTION) as  CollectionReference<PicDoc>;

    return collectionData<PicDoc>(
      query(pdCollection, where('img_name','==',iname)),
        {idField: 'id'}
      );
  }

  addPicDoc(picdoc: PicDoc) {
    console.log('picdocService addPicDoc', picdoc);
    const pd = this.denormGoesto(picdoc);
    const picDocsCollection = collection(this.firestore,  COLLECTION);
    return addDoc(picDocsCollection, pd);
  }

  deletePicDoc(picdoc: PicDoc) {
    const picDocRef = doc(this.firestore,  `${COLLECTION}/${picdoc.id}`);
    return deleteDoc(picDocRef);
  }

  updatePicDoc(picdocChgs: Partial<PicDoc>) {
    // TODO if updating itemsseen, make sure to denormalize
    const picDocRef = doc(this.firestore,  `${COLLECTION}/${picdocChgs.id}`);
    return updateDoc(picDocRef, picdocChgs);
  }

  private denormGoesto(pd: PicDoc): PicDoc {

    pd.numItemsseen = pd.itemsseen ? pd.itemsseen.length : 0;
    pd.recipients = [];
    pd.itemsseen?.forEach(its => {
      if(its.goesTo?.to) {pd.recipients.push(its.goesTo?.to)}
    })
    pd.recipients = pd.recipients.filter((r, i) => i === pd.recipients.indexOf(r));

    return pd;
  }

  // async uploadImageForPicDoc(img: Blob, picdoc: PicDoc){
  //   const path = `images`
  //   const storageRef = ref(this.storage, path);
  //   const metadata: UploadMetadata = {} // TODO add a name-as-key from picdoc
  //   try {
  //     await uploadBytes(storageRef, img, metadata );
  //     const downloadURL = await getDownloadURL(storageRef);
  //     const pdRef = doc(this.firestore, `COLLECTION/${picdoc.id}`)
  //     await updateDoc(pdRef, {downloadURL});
  //     return downloadURL;
  //   } catch (e) {
  //       console.log(e);
  //       return null;
  //   }
  // }
}
