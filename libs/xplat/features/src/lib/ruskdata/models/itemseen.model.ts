// describe the things in the picture

import { Timestamp } from "@angular/fire/firestore"

export interface ItemSeen {
  id?: string,
  isDeleted: boolean, // clear this itemSeen
  desc?: string,
  addedOn: Timestamp, // will be a Timestamp
  addedBy: string, // user id
  twicFocus?: string,
  category?: string[],
  annoID?: string, // ID into annotations
  goesTo?: {to: string,
            accordingTo: string
  }
}
