import { Injectable } from '@angular/core';
import { ConnectableObservable, Observable, of } from 'rxjs';
import { ICue } from '../../models';
import { CueIOService } from '../cue-io/cue-io.service';


@Injectable({
  providedIn: 'root',
})
export class CuemgrService {

  constructor(private cueIoSvc: CueIOService) {  }

  attachCuesForMedia(mid: string, track: TextTrack | undefined, userId: string) : number {
    let cuesAttached = 0;
    if(!track){
      console.log('attachCuesForMedia got undefined TextTrack');
      return 0;
    }
    // read in the cues based on the userId and mediaId

    // this.cueIoSvc.getCueDocs('dummyMediaId','dummyUserId').subscribe((cuesDoc) =>{
    //   console.log('firestore returned', cuesDoc)
    // })
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
    console.log('cuesAttached count is ', cuesAttached);
    return cuesAttached;
  }


}
