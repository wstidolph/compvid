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

import { Observable, forkJoin, BehaviorSubject } from 'rxjs';

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

  constructor(private firestore: Firestore, private storage: Storage,
    private pds: PicdocService, private iss: ItemseenService) {}
  // TODO query/attach 'dispositions' under each PicDoc

  private pdWithItemSeen = new BehaviorSubject<PicDocWithItemsSeen[]>([]);
  picdocsWithItemSeens$ = this.pdWithItemSeen.asObservable();

    // list the images in a temp upload bucket,
  // make wrapper objects array and put array into the Observable
  getImageListInPicDocs(bucket = '') {
    const storage = getStorage();
    const listRef = ref(storage, bucket);
    // the Firebase Storage API is Promise-based
    // so we handle the Promises but then pass result into an Observable array
    listAll(listRef).then((piclist) => {
      console.log('listAll piclist', piclist)
       this.makePicDoc(piclist).then((pd) => {
          console.log('listall handling', pd);
          const emptyItemsseen: ItemSeen[] = [];
          const pdwi: PicDocWithItemsSeen[] =
              pd.map( apd => {
                return {pd: apd, itemseens: emptyItemsseen}
              });
          this.pdWithItemSeen.next(pdwi)
       })
    })
  }


  // normally a PicDoc is stored with the DownloadURL; but, for the use case
  // of starting from the bulk-uploaded images, we have to construct the
  // PicDocs and ensure we don't re-process the image (ending up with multiple
  // PicDocs for s single image)
  private makePicDoc(list : ListResult) : Promise<PicDoc[]> {
    const pds: PicDoc[] = [];
    const gduArray: Promise<string>[] = [];

    list.items.forEach((itemRef) => {
      console.log('makePicDoc itemref', itemRef._location.path)
      this.pds.getPicDocById(itemRef.name).subscribe( (found) => {
        console.log('processing', found);
        const pd: PicDoc = {name: found.name// will be good enough to be the picdoc<-->storage key
          // items: found? found.items : []
        // downloadUrl string comes in when Promise resolves
        };
        const p = getDownloadURL(itemRef)
                  .then((url) => pd.downloadUrl = url);
        gduArray.push(p); // so we can wait for all the promises to resolve
        pds.push(pd);
      });
    }); // forEach

    return Promise.all(gduArray)
      .then( () => {return pds})
  }


}
