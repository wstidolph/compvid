import { Timestamp } from "@angular/fire/firestore/firebase";
import { Place } from "./place.model";

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
  mediaUrl: string; // where to find for migration inload
  downloadURL?: string; // cached Firestore Storage download URL
                        // probably going away

  numItemsseen: number;
  uploadedBy?: string; // user ID

  recipients: string[]; // copied from itemsseen.goesTo.to field
                        // for "what pics have something goe to Bob?"
  itemsseen?: [{
    // id: number,
    isDeleted: boolean, // clear this itemSeen
    desc: string,
    addedOn: Timestamp,
    focus?: string,
    category?: string,
    goesTo?: {to: string,
              accordingTo: string
    }
  }]
}
