export interface IMedia {
  author: string;
  sources: IMediaSource[];
  tags: string[];
  dateCreated?: Date;
  lengthMS?: number;
  courses?: string[]; // "courseID_lessonID"
  irt?: string; // ID of 'parent' media
}

export interface IMediaSource {
  src: string; // URL
  type: string; // e.g., video/ogg
}
