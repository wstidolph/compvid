// LEssons can stand alone, or can (optionally) belong to Courses
export interface Course {
  name: string;
  topics: string[],
  reviews: string[]; // how to ref a subcollection?
  teacherDetails: string // User uid
  regRequired: boolean;
}
// *Public created by cloud functions
export interface CoursePublic {
  name: string;
  numEditions: number;
  avgClassSize: number;
  topics: string[];
  teacherNickName: string;
  reviewAvgScore: number;
  recentReviewSnippets: string[];
  nextStart?: Date;
}

export interface CourseReview { // subcollection
  date: Date;
  reviewer: string; // reviewer uid
  reviewerPlatform?: string;
  reviewerPlatformVersion?: string;
  reviewerNickName: string; // "Wayne S."
  reviewerExpertise: string; // "describe self in this topic..."
  courseEdition: string; // course edition id
  score: number; // as entered
  headline: string; // as entered
  text: string; // as entered
}
// *Public created by cloud functions
export interface CourseReviewPublic {
  date: Date;
  reviewerNickName: string; // "Wayne S."
  reviewerExpertise: string; // "describe self in this topic..."
  score: number; // normalized/sanitized
  headline: string; // "sanitized"
  text: string; // "sanitized"
}

export interface CourseEdition {
  course: Course;
  edition: string;
  dateStarted: Date;
  dateDone: Date;
  schedule_status: CourseEditionSchedStatus
  reg_status: CourseEditionRegStatus
}

export enum CourseEditionRegStatus {
  NOT_YET_OPEN_REG,
  OPEN_REG,
  CLOSED_REG,
  CANCELLED
}
export enum CourseEditionSchedStatus {
  RESERVED, // planned, not yet scheduled
  SCHEDULED, // dates set
  HAPPENING, // in progress
  WRAPUP, // after-lessons interval for grading etc
  COMPLETED, // class editoin ready to archive
  CANCELLED // incomplete, ready to archive or delete
}

export interface Lesson {
  course?: Course; // or courseId string?
  topics: string[];
  teacherNickName: string;
  teacher: string; // User uid
}

export interface LessonPublic {
  course?: Course; // or courseId string?
  topics: string[];
  teacherNickName: string;
  reviewAvgScore: number;
  recentReviewSnippets: string[];
  lesson: string; // Lesson id
}

  // *Public created by cloud functions
export interface LessonReview {
  asPartOfCourse: string;
  asPartOfEdition: string;
  reviewerPlatform?: string;
  reviewerPlatformVersion?: string;
  reviewDate: Date; // for recency
  score: number; // as entered
  headline: string; // as entered
  text: string; // as entered
  reviewer: string; // user id
}
// *Public created by cloud functions
export interface LessonReviewPublic {
  reviewerNickname: string;
  reviewDate: Date;
  reviewScore: number; // normalized, sanitized
  reviewHeadline: string; // sanitized
  reviewText: string; // sanitized
}

export enum StudentRegStatus {
  ANON, // sitting in on the class
  NOT_REG, // identified but not registered
  REGISTERED, // satisfied reg process (maybe paid?)
  DROPOUT // cancelled attendence (maybe refunded?)
}
