export interface ICommentTree {
  id: string;
  aboutMedia: string;
  aboutCue: string;
  lastUpdatedDate: Date;
  authorsInTree: string[]; // author IDs
  commentary: string; // jsonDoc of comment and replies
}
