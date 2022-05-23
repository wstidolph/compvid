import { Timestamp } from "@angular/fire/firestore/firebase";
import { Place } from "./place.model";

export interface PicDoc {
  id?: string;
  name: string;
  desc?: string;
  picTakenDate?: Timestamp;
  editDate: Timestamp;
  loc?: string; // a Place namesInOrder key
  mediaUrl: string;
  storageId: string;
  numItemsseen: number;
  uploadedBy?: string; // user ID
  downloadURL?: string;
  recipients: string[]; // copied from itemsseen.goesTo.to field
                        // for "what pics have something goe to Bob?"
  itemsseen?: [{
    // id: number,
    desc: string,
    addedOn: Timestamp,
    whereInPic?: string,
    category?: string,
    goesTo?: {to: string,
              accordingTo: string
    }
  }]
}
