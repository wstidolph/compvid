// describe the things in the picture

// import { Timestamp } from "@angular/fire/firestore"
import { GoesTo } from './goesTo.model'

export interface ItemSeen {
  id?: string,
  isDeleted: boolean, // clear this itemSeen
  desc?: string,
  addedOn: Date, //
  addedBy: string, // user id
  twicFocus?: string,
  category?: string[],
  annoID?: string, // ID into annotations
  goesTo?: GoesTo
}
