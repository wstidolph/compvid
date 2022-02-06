import { Directive, DoCheck, ElementRef, EventEmitter, OnDestroy, Output } from '@angular/core';
import { BaseComponent } from '@compvid/xplat/core';
import {
  VgApiService,
  VgEvents,
  VgMediaDirective,
} from '@videogular/ngx-videogular/core';
import { fromEvent, Subscription, Observable } from 'rxjs';
import { ICue, ICueTrack, IMediaSource, Strings } from '../models';
import { CueIOService, CuemgrService, MediacoordService, MediaIOService } from '../services';

/**
 * Provide ngx-videogular data/event hookup with services,
 * and does some DOM-specific data manipulation (because
 * it's easier to test in a COmponent than it is to figure
 * out how to get a real DOM supported in Jest-based unit tests!)
 * Templates are provided by subclasses (so, for example,
 * 'ionic' can be different from 'web')
 *
 */
@Directive()
export abstract class MplayerBaseComponent extends BaseComponent  {
  public text = 'MplayerBase';

  userId='wayne'; // dummy
  api!: VgApiService;
  mediaIds: string[] = [];
  activeCuePoints: { [key: string]: ICue[] } = {};

  totalCues = 0;

  constructor(
    public ref: ElementRef,
    public mcsvc: MediacoordService,
    public cmgrsvc: CuemgrService,
    public ciosvc: CueIOService,
    public miosvc: MediaIOService) {
    super();
  }

  // -------- DOM event handlers ------- //
  onPlayerReady(api: VgApiService) {
    this.api = api;
    console.log('MBC onPlayerReady gets api', this.api);
    this.mediaIds = this.mcsvc.registerPlayer(this);
    this.mcsvc.setLeader('media2');
    this.mediaIds.forEach(mid => {
      this.api.getMediaById(mid)
      .subscriptions.loadedMetadata.subscribe(this.onLoadedMetadata.bind(this));
    })
  }

  onLoadedMetadata(evt: any) {
    console.log('MBC onLoadedMetadata gets', this, evt)
    const mid = evt.target.id;
    this.addCueTrack(mid, this.userId)
    console.log('hi');
  }

  onCueChange($evt: any) {
    console.log('MBC onCueChange got', $evt, $evt.srcElement.activeCues)
  }

  onEnterCuePoint(mediaId: string, $evt: VTTCue) {
    console.log('MBC onEnterCuePoint', mediaId);
    // tell MediaCoordination
    this.mcsvc.enterCue(mediaId, $evt);
  }

  onExitCuePoint(mediaId: string, $evt: VTTCue) {
    console.log('MBC onExitCuePoint', mediaId);
        // tell MediaCoordination
    this.mcsvc.exitCue(mediaId, $evt);
  }
  // -------- DATA SETUP --------- //

  getCuetrackForMediaAndUser(mediaid: string, userid: string): ICueTrack {
    const ict: ICueTrack = { // fetch from cueIoService
      id: '0',
      user: '0',
      aboutMedia: 'dummy',
      dateCreated: new Date('2022/01/01'),
      lastUpdated: new Date('2022/01/01')
    }
    return ict;
  }

  /**
   * get the list of URL objects that are source-element attributes
   * for this media; array return allows for multiple srcs
   * @param mediaID
   */
   getSrcListForMediaId(mediaID: string) : IMediaSource[] {

    if(mediaID == null || mediaID == '') {
      return [];
    }
    const resArray = this.miosvc.getSrcListForMediaId(mediaID);
    return resArray;
  }

  // -------- ACTION ------------- //
  /** set position but don't change play-state or play rate */
  seekToCue(mediaId: string, cueId: string) {
    const theCue = this.findCueById(mediaId, cueId);
    if(theCue == null) return;
    const cueStartTime = theCue.startTime;

    const media = this.findMediaFromMediaId(mediaId);
    // we know media is non-null because the earlier findCueById succeeded
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    media!.seekTime(cueStartTime); // TODO animate the seeking to be smoother
                                          // ideas: http://www.developphp.com/video/JavaScript/Video-Player-Custom-Controls-Programming-Tutorial
  }
  // --------  UTILITIES --------- //
  findMediaFromMediaId(mediaId: string): VgMediaDirective | undefined {
    const media: VgMediaDirective = this.api.getMediaById(
      mediaId
    ) as VgMediaDirective;

    if(media == null){
      console.warn(`MplayerBase #findMediaFromId did not find media with id ${mediaId}`);
    }
    return media;
  }
  findTextTrackFromMediaId(mediaId: string): TextTrack | undefined {
    const media = this.findMediaFromMediaId(mediaId);
    if(media == null) return;

    return this.findTextTrackFromMedia(media);
  }
  findTextTrackFromMedia(media: VgMediaDirective) {
    const ttracks = media.textTracks;
    if(ttracks == null){
      console.warn(`MplayerBase #findTextTrackFromMedia did not find any text track on media with id ${media.id}`, media);
      return;
    }
    const ttrack = ttracks.getTrackById(Strings.CvCueTrack);
    if(ttrack == null){
      console.warn(`MplayerBase #findTextTrackFromMedia did not find any ${Strings.CvCueTrack} track on media with id ${media.id}, tracks is ${ttracks}` );
      return;
    }
    return ttrack;
  }
  findCueById(mediaId: string, cueId: string): TextTrackCue | null | undefined {
    const ttrack = this.findTextTrackFromMediaId(mediaId);
    if(ttrack == null) return;

    const theCue = ttrack.cues?.getCueById(cueId);
    if (!theCue) {
      const media = this.findMediaFromMediaId(mediaId);
      console.warn(
        `MPlayerBase #findCueById could not find cue ${cueId} on media ${media}`, ttrack.cues
      );
      return;
    }
    return theCue;
  }
  addTextTrackToMediaById(mediaId: string) : TextTrack | undefined {
    const media = this.findMediaFromMediaId(mediaId);
    if(media == null) return;
    return this.addTextTrackToMedia(media);
  }
  addTextTrackToMedia(media: VgMediaDirective): TextTrack {
    return media.addTextTrack('metadata', Strings.CvCueTrack);
  }
  findOrAddTextTrackForMedia(media: VgMediaDirective): TextTrack {
    let t1 = this.findTextTrackFromMedia(media) // addTextTrack('metadata', 'CC_'+mediaId, 'en', 'hidden');
    if(t1 == null){ // then we need to add a TextTrack
      t1 = this.addTextTrackToMedia(media);
    }
    return t1;
  }
  /**
   * Add User's cues to a media inside the player
   * @param mediaId
   * @param userId
   * @returns
   */
  addCueTrack(mediaId: string, userId: string) {
    console.log('MPlayerBase #addCues adding cues to', mediaId, userId);
    const media = this.findMediaFromMediaId(mediaId);
    if(media == null) { return;}

    let ttrack = this.findOrAddTextTrackForMedia(media); // FIXME INCOMPLETE

      // this.subscriptions.push(
      //  fromEvent(t1, 'cuechange').subscribe(this.onCueChange.bind(this)));

  }

   /** make an array, orderd by cue start time */
   makeCueArrayFromList(list: TextTrackCueList | null | undefined): TextTrackCue[] {
    // console.log('MPlayerBase #makeCueArrayFromList', list)
    if(list == null || list == undefined || list?.length == 0) return [];

    const arr = [];

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
  /**
   * Make a VTTCue from an ICue  - if it's a valid descriptor
   * throw err is, for example, endTime<startTime, id malformed, etc
   * @param cue
   * @returns
   */
  makeVttCue(cue: ICue): VTTCue| null {
    if(cue.id == null || cue.id == ''
      || cue.startTime < cue.endTime
    ) {
      console.warn("MPlayerBase #makeVttCue got malformed cue", cue);
      return null;
    }
    const jsonText = JSON.stringify(cue);
    const vttc = new VTTCue(cue.startTime, cue.endTime, jsonText);
    vttc.id = cue.id;
    return vttc;
  }
  isValidMediaId(mediaId:string): boolean {
    let isValid = true;
    const isEmpty = mediaId == '';
    // add tests for schama match // TODO
    isValid = !isEmpty;
    return isValid;
  }

  attachCuesForMediaById (cues: ICue[], mediaId: string) : number {
    if(cues ==null || cues.length == 0) {
      console.warn('MPlayerBase #attachCuesToMediaById got no cues');
      return 0;
    }

    if(!this.isValidMediaId(mediaId)) {
      console.warn('MPlayerBase #attachCuesToMediaById got invalid mediaId', mediaId);
      return 0;
    }

    const media = this.findMediaFromMediaId(mediaId);
    if(media == null) {
      return 0;
    }
    return this.attachCuesToMedia(cues, media);
  }
  attachCuesToMedia(cues: ICue[], media: VgMediaDirective) : number {
    if(cues ==null || cues.length == 0) {
      console.warn('MPlayerBase #attachCuesToMedia got no cues');
      return 0;
    }
    if(media ==null ) {
      console.warn('MPlayerBase #attachCuesToMedia got no media');
      return 0;
    }

    const validCues: VTTCue[] = [];
    cues.forEach(cue => {
      const vcue = this.makeVttCue(cue);
      if(vcue !== null) {
        validCues.push(vcue)
      }
    })

    if(validCues.length >0){
      const track = this.findOrAddTextTrackForMedia(media);
      validCues.forEach(c => track.addCue(c));
    }

    return validCues.length;;
  }

}

