export interface ICue {
  id: string;
  startTime: number;
  endTime: number;
  title?: string,
  description?: string,
  playRate?: number;
}

export interface ICueTrack {
  id: string;
  user: string;
  authviewers: string[]; //
  dateCreated: Date;
  lastUpdated: Date;
  cues?: string; // a JSON doc of ICues
  aboutMedia: string; // media ID
}

export type usermediacues = {
  [uid: string] : { [mid:string] : ICue[]}
}
