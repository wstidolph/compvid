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
import { ItemSeen, PicDoc } from '../models';
import {convertSnaps, ensureStrInOnce, ensureStrInNone} from './data-utils';

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
    { isDeleted: false,
      desc: 'sample item seen',
      addedOn: new Date(),
      addedBy: '#11111111111',
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
    const recip = this.makeRecipients(picdoc);
    picdoc.recipients = recip;
    const picDocsCollection = collection(this.firestore,  COLLECTION);
    return addDoc(picDocsCollection, picdoc);
  }

  deletePicDoc(picdocid: string) {
    const picDocRef = doc(this.firestore,  `${COLLECTION}/${picdocid}`);
    return deleteDoc(picDocRef);
  }

  updatePicDoc(PD: PicDoc, picdocChgs: Partial<PicDoc>) {
    // TODO if updating itemsseen, make sure to denormalize
    // console.log('PD Svc update gets changes', picdocChgs);

    // console.log('PD Svc PD is', PD)
    const picDocRef = doc(this.firestore,  `${COLLECTION}/${picdocChgs.id}`);
    const recip = this.makeRecipients(picdocChgs);
    if(recip?.length > 0) picdocChgs.recipients = recip;
    picdocChgs.numItemsseen = picdocChgs.itemsseen? picdocChgs.itemsseen.length : 0;

    // console.log('PD Svc update computes changes', picdocChgs);
    return updateDoc(picDocRef, picdocChgs);
  }

  // ItemSeen is should be kept
  mergeItemSeenEntries() {

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
        : ensureStrInNone(dd.favOf, uid);
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
  private makeRecipients(pdc:Partial<PicDoc>) : string[] { // ignoring accordingTo, for now
    console.log('PD Svc makeRecipients gets ', pdc )
    const recipients: string[] = [];

    pdc.itemsseen?.forEach((its:ItemSeen) => {
      if(its.goesTo && its.goesTo.to) { // max of one single recipient, for now
        ensureStrInOnce(recipients, its.goesTo.to)
      }
    })

    console.log('PD Svc makeRecipients returning ', recipients )
    return recipients;
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
