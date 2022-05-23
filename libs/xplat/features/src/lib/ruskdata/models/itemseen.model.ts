// describe the things in the picture
export interface ItemSeen {
  id: string;
  inpicdoc: string; // item is seen in (join key)
  desc: string;     // description of the Item
  goesTo: string;   // disposition target
  note:string;      // commentary/justification
  author: string;   // of the description
}
