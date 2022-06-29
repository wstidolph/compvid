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
  getDoc,
} from '@angular/fire/firestore';

import {
  getDownloadURL,
  ref,
  Storage, uploadBytes, UploadMetadata
} from '@angular/fire/storage'

import { Observable, BehaviorSubject, of, map, tap } from 'rxjs';
import { isNullOrUndefined } from 'util';
import { UserService } from '../../user';
import { PicDoc } from '../models';
import {convertSnaps, ensureStrInOnce, esnsureStrInNone} from './db-utils';

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
  favOf:[],
  recipients: [],
  itemsseen: [
    { desc: 'sample item seen',
      addedOn: Timestamp.fromDate(new Date()),
      isDeleted: false,
      twicFocus: "200x200",
      goesTo: [{
        to: 'DS',
        accordingTo: 'WS'
      }],
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

  constructor(private firestore: Firestore, private storage: Storage,
    private userService: UserService) {
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
              if(results.length >1) {
                console.warn(`PicDocService getPicDocByImgBasename multiple results for ${imgBasename}`, results);
              }
              return results.length >0 ? results[0] : null
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

  deletePicDoc(picdocid: string) {
    const picDocRef = doc(this.firestore,  `${COLLECTION}/${picdocid}`);
    return deleteDoc(picDocRef);
  }

  updatePicDoc(picdocChgs: Partial<PicDoc>) {
    // TODO if updating itemsseen, make sure to denormalize
    const picDocRef = doc(this.firestore,  `${COLLECTION}/${picdocChgs.id}`);
    const changes = this.denormGoesto(picdocChgs);
    console.log('changes', changes);
    return updateDoc(picDocRef, changes);
  }

  async setFavState(pd: PicDoc, isFav: boolean) { // todo just pass in ID
    if(!pd) return;

    const uid=this.userService.uid;
    if(!uid) return;

    // fetch current doc by id
    const picDocRef = doc(this.firestore,  `${COLLECTION}/${pd.id}`);
    const docSnap = await getDoc(picDocRef);
    if(docSnap.exists()) {
      const dd = docSnap.data() as PicDoc;
      const [needsUpdate, newArray] =
      isFav ?
          ensureStrInOnce(dd.favOf, uid)
        : esnsureStrInNone(dd.favOf, uid);
      // console.log('picDocService setFavState: needsUpdate, newArray', needsUpdate, newArray)
      if(needsUpdate) {
        // update just the favs on doc in DB
        // console.log('picDocService setFavState update ', pd.id, newArray);
        updateDoc(picDocRef, {favOf : newArray })
          .then(
            //rtn => console.log('picDocService setFavState update got', rtn)
          )
          .catch(err => console.warn('picDocService setFavState update err', err))
      }
    } else {
      console.warn('cannot setFav on nonexist doc', pd.id)
    }
  }

  isFavOf(pd: PicDoc) : boolean {
    const uid=this.userService.uid;
    if(!uid || !pd || !pd.favOf) return false;
    return (pd.favOf.length>0 && pd.favOf.indexOf(uid) > -1)
  }

  /* --- PRIVATE UTILITY FUNCTIONS --- */
  private denormGoesto(ppd:any) { // ignoring accordingTo, for now

    ppd.numItemsseen = ppd.itemsseen ? ppd.itemsseen.length : 0;
    ppd.recipients = [];
    // itemsseen?: [{
    // ...
    //   goesTo?: [{to: string,
    //             accordingTo: string
    //   }]
    // }]
    ppd.itemsseen?.forEach((its:any) => {
      if(its.goesTo?.length>0) {
        its.goesTo.forEach((gt:any) => {
          console.log('process goesto', gt);
          ppd.recipients.push(gt);
        })
      }
    })
    ppd.recipients = ppd.recipients.filter((r:any, i:number) => i === ppd.recipients.indexOf(r));
    return ppd;
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
