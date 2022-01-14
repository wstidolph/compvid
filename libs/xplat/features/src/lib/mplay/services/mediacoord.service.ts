import { Injectable } from '@angular/core';
import { IPlayable, VgApiService } from '@videogular/ngx-videogular/core';
import { MplayerBaseComponent } from '../base/index';
import { FollowerMode } from '../models/FollowerMode';

@Injectable({
  providedIn: 'root',
})
export class MediacoordService {
  // constructor() {}

  api: VgApiService | null = null;
  player: MplayerBaseComponent | null = null;
  mediaIds: string[] = []; // the list of known media (video tags)

  leaderId = ''

  /** called when VgPlayer is ready
   * NOTE: this is before metadata (cues) are loaded!
  */
  registerApi(api: VgApiService) {
    if(api) {
      this.api = api;
      console.log('MCS register API with medias', api.medias);
      this.mediaIds = this.getMediaIds();
      console.log('MCS medias', this.mediaIds)
    } else {
      console.warn('MCS null API passed to MediacoordService');
      return;
    }
  }

  registerPlayer(player: MplayerBaseComponent) : string[] {
    this.player = player;
    const api = player.api;
    this.registerApi(api);
    return this.mediaIds;
  }

  setLeader(leaderId: string) {
    this.leaderId = leaderId;
    console.log('MCS setting leaderId to', this.leaderId);
  }

  /**
   * Set follower (by mediaId) to track leader, according to mode
   * @param leaderId Set
   * @param followerId
   * @returns
   */
  setToFollow(leaderId: string, followerId: string, mode: FollowerMode) {
    const leaderMedia = this.api?.getMediaById(leaderId);
    const followerMedia = this.api?.getMediaById(followerId);
    if(leaderMedia == null || leaderMedia == undefined) {
      console.warn('MCS setToFollow got unmatched leaderId', leaderId)
      return
    }
    if(followerMedia == null || followerMedia == undefined) {
      console.warn('MCS setToFollow got unmatched followerId', followerId)
      return
    }

  }

  /**
   *
   * @param mediaId the VgMedia tag entering a cue
   * @param cue the actual VttCue object
   */
  enterCue(mediaId: string, cue: VTTCue){
    console.group('MCS enterCue', cue.id, mediaId)
    console.log('MCS entered cue on ', mediaId,cue)
    console.log('MCS cue duration', cue.endTime - cue.startTime)
    console.log('MCS media', this.api?.getMediaById(mediaId))
    console.groupEnd()
  }

    /**
   *
   * @param mediaId the VgMedia tag exiting a cue
   * @param cue the actual VttCue object
   */
  exitCue(mediaId: string, cue: VTTCue){
    console.group('MCS exitCue', cue.id, mediaId)
    console.log('MCS exited cue', mediaId,cue)
    console.log('MCS media', this.api?.getMediaById(mediaId))
    console.groupEnd()
  }

  private getMediaIds() : string[] {
    if(this.api?.medias){
      return Object.keys(this.api?.medias)
    } else {
      console.warn('MCS getMediaIds sees no medias')
      return []
    }
  }

  /** seek all to same-id cue start */
  private seekAllOthers(mediaId: string, cue: VTTCue) {
    this.mediaIds.forEach(mid => {
      if (mid != mediaId) {
        console.log('MCS seeking to cue', mid, cue.id);
        this.player?.seekToCue(mid, cue.id)
      }
    })
  }
}
