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
  QueryConstraint,
} from '@angular/fire/firestore';

import {
  getDownloadURL,
  ref,
  Storage, uploadBytes, UploadMetadata
} from '@angular/fire/storage'
import { AnyRecord } from 'dns';

import { Observable, BehaviorSubject, of, map, tap } from 'rxjs';
import { isNullOrUndefined } from 'util';
import { UserService } from '../../user';
import { GoesTo, GoesToOption, ItemSeen, PicDoc } from '../models';
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
  twicFocus: "250x250",
  favOf:[],
  numRecipients: 0,
  recipients: [],
  numItemsseen: 0,
  itemsseen: [
    { isDeleted: false,
      desc: 'sample item seen',
      addedOn: new Date(),
      addedBy: '#11111111111',
      twicFocus: "200x200",
      goesTo: {
        shortName: 'Ferd',
        toId: 'edclcdC6Z6wS0y5UMW8iNg94JVtA',
        toFullname: 'Ferdinand',
        accordingTo: 'WS', // become user ID
        accordingToId: 'kf9XmORCHlb0re97joOc'
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
  getPicDocByIsFav(){
    const pdCollection =
      collection(this.firestore, COLLECTION, ) as  CollectionReference<PicDoc>;
      return collectionData<PicDoc>(
        query(pdCollection, where('favOf','array-contains',this.userService.uid)),
          {idField: 'id'}
        )
        // .pipe(
        //     map(results => {
        //       return results.length >0 ? results[0] : null
        //   })
        // )
  }

  // query for AND of
  // * favorites status (DC, T),
  // * number of recipients (don't-care, 0, 1, many), and
  // * number of items seen (don't-care, 0, 1, many)
  getFilteredPicDoc(favFilter: string, numRecip: number, numITS: number) {
    console.log(`PD Svc getFilteredPicDoc args favFilter ${favFilter}, numRecipt ${numRecip}, numITS ${numITS}`);

    const qc:QueryConstraint[] = []

    if(favFilter == 'T') {
      qc.push(where('favOf','array-contains',this.userService.uid))
    }

    if(numRecip == 0 || numRecip == 1) {
      qc.push(where('numRecipients','==', numRecip))
    }

    if(numRecip > 1) {
      qc.push(where('numRecipients', '>=', 1))
    }

    if(numITS == 0 || numITS == 1) {
      qc.push(where('numItemsseen','==', numITS))
    }

    if(numRecip > 1) {
      qc.push(where('numItemsseen', '>=', 1))
    }

    console.log('query terms', qc.length);
    const pdCollection =
      collection(this.firestore, COLLECTION ) as  CollectionReference<PicDoc>;
    const refq = query(pdCollection, ...qc);
    console.log('PD Svc getFilteredPicDoc refq', refq)
    return collectionData<PicDoc>(refq, {idField: 'id'})
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

  private mapGtoToGT(gto: any): GoesTo {
    const GT:GoesTo = {
      shortName:'unknown',
      accordingTo: this.userService.profileNow?.nickname ?? 'ME',
      accordingToId: this.userService.uid?? 'OTHER',
    }
    if(gto.shortName) {GT.shortName = gto.shortName;}
    if(gto.toId) {GT.toId = gto.uid;}
    if(gto.fullName) {GT.toFullname= gto.fullName;}
    if(gto.id) {GT.gtoId = gto.id;}
    return GT
  }

  updatePicDoc(PD: PicDoc, picdocChgs: Partial<PicDoc>) {
    // TODO if updating itemsseen, make sure to denormalize
    console.log('PD Svc update gets changes', picdocChgs);

    // console.log('PD Svc PD is', PD)
    picdocChgs.itemsseen?.forEach ( (its) => {
        // its goesTo is an array if the Select control has the 'multiple' option
        // TODO decide if goesTo should be an Array - semantics are unclear
        if(its.goesTo ) {
          its.goesTo = this.mapGtoToGT(its.goesTo );
        }
      }
    )
    const recip = this.makeRecipients(picdocChgs);
    picdocChgs.numRecipients = recip? recip.length : 0;
    // if(recip?.length > 0)
    picdocChgs.recipients = recip;
    picdocChgs.numItemsseen = picdocChgs.itemsseen? picdocChgs.itemsseen.length : 0;

    console.log('PD Svc update picdocChgs final', picdocChgs);
    const picDocRef = doc(this.firestore,  `${COLLECTION}/${picdocChgs.id}`);
    // console.log('PD Svc update computes changes', picdocChgs);
    return updateDoc(picDocRef, picdocChgs);
  }

  // ItemSeen is should be kept
  mergeItemSeenEntries() {
    console.log('PD Svc mergeItemSeenEntries called, empty method')
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
      if(its.goesTo && its.goesTo.shortName) { // max of one single recipient, for now
        ensureStrInOnce(recipients, its.goesTo.shortName)
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
