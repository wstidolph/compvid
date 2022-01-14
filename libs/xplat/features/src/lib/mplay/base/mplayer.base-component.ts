import { Directive, DoCheck, ElementRef, EventEmitter, OnDestroy, Output } from '@angular/core';
import { BaseComponent } from '@compvid/xplat/core';
import {
  VgApiService,
  VgEvents,
  VgMediaDirective,
} from '@videogular/ngx-videogular/core';
import { fromEvent, Subscription, Observable } from 'rxjs';
import { ICuePoint } from '../models';
import { CuemgrService, MediacoordService } from '../services';

/**
 * Provide ngx-videogular data/event hookup with services.
 * Templates are provided by subclasses (so, for example,
 * 'ionic' can be different from 'web'
 *
 )
 */
@Directive()
export abstract class MplayerBaseComponent extends BaseComponent  {
  public text = 'MplayerBase';

  userId='wayne'; // dummy
  api: VgApiService;
  mediaIds: string[] = [];
  activeCuePoints: { [key: string]: ICuePoint[] } = {};

  totalCues = 0;

  constructor(public ref: ElementRef, public mcsvc: MediacoordService, public cmgrsvc: CuemgrService) {
    super();
  }

  onPlayerReady(api: VgApiService) {
    this.api = api;
    console.log('MPlayerBase api', this.api);
    this.mediaIds = this.mcsvc.registerPlayer(this);
    this.mcsvc.setLeader('media2');
    this.mediaIds.forEach(mid => {
      this.api.getMediaById(mid)
      .subscriptions.loadedMetadata.subscribe(this.onLoadedMetadata.bind(this));
    })
  }

  /** load all the cues */
  onLoadedMetadata(evt: any) {
    console.log('MBC onLoadedMetadata gets', this, evt)
    const mid = evt.target.id;
    this.addCues(mid, this.userId)
  }

  addCues(mediaId: string, userId: string) {
    console.log('MBC addCues adding cues to', mediaId, userId);
    const m1 = this.api.getMediaById(mediaId);

    if (m1) {
      const t1: TextTrack = m1.textTracks[0]; // addTextTrack('metadata', 'CC_'+mediaId, 'en', 'hidden');
      // this.subscriptions.push(
      //  fromEvent(t1, 'cuechange').subscribe(this.onCueChange.bind(this)));
      const numCuesAttached = this.cmgrsvc.attachCuesForMedia(mediaId, t1, userId);
      console.log('MBC addCues attached ', numCuesAttached, t1.cues);
      // this.updateCuePoints(this.cmgrsvc.makeCueArrayFromList(t1.cues));
    } else {
      console.log(
        'MBC addCues did not find media by id',
        mediaId
      );
    }
    console.log('MBC addCues made media', m1);
  }

  onCueChange($evt: any) {
    console.log('MBC onCueChange got', $evt)
    console.log($evt.srcElement.activeCues)
  }

  onEnterCuePoint(mediaId: string, $evt) {
    console.log('MBC onEnterCuePoint', mediaId);
    this.mcsvc.enterCue(mediaId, $evt);
  }

  onExitCuePoint(mediaId: string, $evt) {
    console.log('MBC onExitCuePoint', mediaId);
    this.mcsvc.exitCue(mediaId, $evt);
  }

  addTextTracks() {}

  /** set position but don't change play-state or play rate */
  seekToCue(mediaId: string, cueId: string) {
    const media: VgMediaDirective = this.api.getMediaById(
      mediaId
    ) as VgMediaDirective;

    const theCue = media.textTracks[0].cues?.getCueById(cueId);

    if (!theCue) {
      console.warn(
        'MPlayerBase seekToCue could not find cue',
        mediaId,
        cueId,
        'media is',
        media,
        'cues',
        media.textTracks[0].cues
      );
      return;
    }
    const cueStartTime = theCue.startTime;
    media.seekTime(cueStartTime);
  }

}

