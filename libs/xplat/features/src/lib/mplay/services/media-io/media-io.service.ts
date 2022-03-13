import { Injectable } from '@angular/core';
import { IMediaSource } from '../../models';

@Injectable({
  providedIn: 'root'
})
export class MediaIOService {

  constructor() { }
    /**
   * get the list of URL objects that are source-element attributes
   * for this media; array return allows for multiple srcs
   * @param mediaID
   */
     getSrcListForMediaId(mediaID: string): IMediaSource[] {
      console.log('MediaIOService #getSrcListForMediaId', mediaID);
      return [];
    }
    fetchMedia(mediaID: string): boolean {
      return false;
    }

}
