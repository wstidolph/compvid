import { CuemgrService, MplayModule } from "..";
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import { TestBed } from '@angular/core/testing';

describe('CuemgrService without Angular testing support', () => {

  let cuemgrService: CuemgrService;
  //mplayModule: typeof MplayModule;
  beforeEach(() => {
    TestBed.configureTestingModule({});
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
  //   const ttrack = new TextTrack;
  //   const jsonData = {
  //     id: 'cid1',
  //     title: 'test',
  //     description: ' dummy description'
  //   }
  //   const jsonText = JSON.stringify(jsonData);
  //   const cue = new VTTCue(15, 25, jsonText);
  //   cue.id = 'cid1'
  //   ttrack.addCue(cue);

  //   const arr = cuemgrService.makeCueArrayFromList(ttrack.cues);
  //   expect(arr.length).toEqual(1);

  // })

}); // ebircsed
