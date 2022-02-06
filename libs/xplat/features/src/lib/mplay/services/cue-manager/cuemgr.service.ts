import { Injectable } from '@angular/core';
import { ConnectableObservable, Observable, of } from 'rxjs';
import { ICue, ICueTrack } from '../../models';
import { CueIOService } from '../cue-io/cue-io.service';


@Injectable({
  providedIn: 'root',
})
export class CuemgrService {

  constructor(private cueIoSvc: CueIOService) {  }

}
