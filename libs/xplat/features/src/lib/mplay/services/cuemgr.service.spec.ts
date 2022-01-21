import { CuemgrService } from "..";

import { TestBed } from '@angular/core/testing';
import { MockProvider, ngMocks } from 'ng-mocks';
import { CueIOService } from "./cue-io/cue-io.service";

import { JSDOM } from 'jsdom';

/**
 * @jest-environment jsdom
 */

ngMocks.autoSpy('jest');

describe('CuemgrService without Angular testing support', () => {

  let cuemgrService: CuemgrService;
  //mplayModule: typeof MplayModule;
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        CuemgrService,
        {provide: CueIOService, useValue: MockProvider(CueIOService)}
      ]
    });
    cuemgrService = TestBed.inject(CuemgrService);
  });
  it('should construct', () => {
    expect(cuemgrService).toBeTruthy;
  })

  it('should make an empty array if no param', () => {
    const arr = cuemgrService.makeCueArrayFromList(null);

    expect(arr).toEqual([]);
  })


// can't run this test because don't have a TextTrack etc outside browser environ  it('should put all Cues into the resulting array', () => {
  it('should make and attach cue objects', () => {
    const dom = new JSDOM(`<video></video>`);

    const v = dom.window.document.querySelector("video");

    const ttrack = v?.addTextTrack('metadata'); // need an empty TextTrack
    const jsonData = {
      id: 'cid1',
      title: 'test',
      description: ' dummy description'
    }
    const jsonText = JSON.stringify(jsonData);
    ttrack?.addCue(new VTTCue(0,0.1, jsonText));

    const arr = cuemgrService.makeCueArrayFromList(ttrack?.cues);
    expect(arr.length).toEqual(1);

  })

}); // ebircsed
