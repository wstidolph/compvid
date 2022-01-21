import { Injectable } from '@angular/core';
import { CueIOService } from './cue-io/cue-io.service';
@Injectable({
  providedIn: 'root',
})
export class CuemgrService {

  constructor(private cueIoSvc: CueIOService) {}

  attachCuesForMedia(mid: string, track: TextTrack, userId: string) : number {
    let cuesAttached = 0;
    // read in the cues based on the userId and mediaId

    this.cueIoSvc.getCueDocs('dummyMediaId','dummyUserId').subscribe((cuesDoc) =>{
      console.log('firestore returned', cuesDoc)
    })
    const jsonData = {
      id: 'cid1',
      title: mid + ' ' + userId,
      description: mid + ' dummy description'
    }
    const jsonText = JSON.stringify(jsonData);
    let cue = new VTTCue(15, 25, jsonText);
    cue.id = 'cid1'
    track.addCue(cue);

    cuesAttached++;
    const jsonData2 = {
      title: mid + ' ' + userId,
      description: mid + ' dummy description'
    }
    const jsonText2 = JSON.stringify(jsonData);
    cue = new VTTCue(5, 10, jsonText2);
    cue.id='cid2';
    track.addCue(cue);
    cuesAttached++;
    return cuesAttached;
  }

  /** make an array, orderd by cue start time */
  makeCueArrayFromList(list: TextTrackCueList | null | undefined): TextTrackCue[] {
    console.log('CMgrSvc makeCueArrayFromList', list)
    if(list ==null) return [];

    const arr: TextTrackCue[] = [];

    for (const cue in list) {
      const vttc = list[cue];
      // console.log('CMgrSvc makeCueArrayFromList processing cue', list[cue]);
      if(list.hasOwnProperty(cue)) arr.push(list[cue]);
    }
    // sort array by startTime
    arr.sort((c1, c2) => (c1.startTime > c2.startTime)? 1 : -1);
    // console.log('CMgrSvc makeCueArrayFromList returns', arr);
    return arr;
  }
}
