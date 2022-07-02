import { Timestamp } from "@angular/fire/firestore/firebase";
import { ItemSeen} from './itemseen.model'


export interface PicDoc {
  isDeleted: boolean; // clear this PicDoc but leave as "archive"
  id?: string; // e.g., Firestore doc ID
  name?: string; // optional human name for the image
  desc?: string;
  picTakenDate?: Timestamp;
  editDate: Timestamp; // last time the PicDoc was edited )itemseen added, etc)
  loc?: string; // a Place namesInOrder key
  img_basename: string; // filename, prob as assigned by camera
  storageId: string; // main image name in Firebase
  externMediaBase: string; // where to find for migration inload
  copyToFirebaseStorage: boolean;
  downloadURL?: string; // cached Firestore Storage download URL
                        // probably going away

  twicFocus?: string; // defaults to middle, but can be set as last
                      // step in transfor chain e.g., 20x10 coordinates
  numItemsseen: number;
  uploadedBy?: string; // user ID
  favOf?:string[]; // uid of those who have fav'ed this pic
  recipients: string[]; // copied from itemsseen.goesTo.to field
                        // for "what pics have something goe to Bob?"
  annotations?:  string[]; // each string in W3C JSON-LD annotations format
  itemsseen?: ItemSeen[]
}
