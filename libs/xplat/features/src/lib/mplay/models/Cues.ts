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
  dateCreated: Date;
  lastUpdated: Date;
  cues?: string; // a JSON doc of ICues
  aboutMedia: string;
}

export type usermediacues = {
  [uid: string] : { [mid:string] : ICue[]}
}
