export interface IMedia {
  author: string;
  irt: string; // ID of 'parent' media
  fileURL: string;
  mediaMimeType: string;
  tags: string[];
  courses: string[]; // "courseID_lessonID"
}
