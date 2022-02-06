import { TestBed, ComponentFixture, waitForAsync } from '@angular/core/testing';
import { MplayerBaseComponent } from './mplayer.base-component';
import { CueIOService, CuemgrService, MediacoordService, MediaIOService } from '../services';
import { Component, ElementRef } from '@angular/core';
import { ngMocks, MockProvider, MockBuilder, MockRender, MockInstance, MockReset, MockDirective} from 'ng-mocks';
import { IMediaSource, ICue} from '../models';
import { cues } from '../cueTestData.json';
import {
  VgApiService,
  VgEvents,
  VgMediaDirective,
} from '@videogular/ngx-videogular/core';
import { from } from 'rxjs';
import { MplayModule } from '..';

/**
 * This tests the non-DOM logic to be inherited by child classes
 * (e.g., ionic, web) using a simplified test-driving ChildCOmponent
 */
@Component({
  selector: 'test-mplayer',
  // template: `
  // <test-mplayer>
  //   <video [VgMedia]="child1">
  //   </video>
  //   <video [VgMedia]="child2">
  //   </video>

  // </test-mplayer> `
})
class ChildComponent extends MplayerBaseComponent {
  constructor(
    public ref: ElementRef,
    public mcsvc: MediacoordService,
    public cmgrsvc: CuemgrService,
    public ciosvc: CueIOService,
    public miosvc: MediaIOService) {
    super(ref, mcsvc, cmgrsvc, ciosvc, miosvc);
  }
}
describe('MplayerBaseComponent thru ChildComponent', () => {

  let component: ChildComponent;
  let fixture: ComponentFixture<ChildComponent>;

  beforeEach(() => {
    return MockBuilder(ChildComponent, MplayModule)
  })
  it('should return an array of sources given a mediaID', () => {
    const testSrcsArray: IMediaSource[] = [
      {
          src: "http://static.videogular.com/assets/videos/videogular.mp4",
          type: "video/mp4"
      },
      {
          src: "http://static.videogular.com/assets/videos/videogular.ogg",
          type: "video/ogg"
      },
      {
          src: "http://static.videogular.com/assets/videos/videogular.webm",
          type: "video/webm"
      }
    ];
    MockInstance.scope('case');
    MockInstance(MediaIOService, 'getSrcListForMediaId', () => testSrcsArray);

    fixture = MockRender(ChildComponent);
    expect (fixture).toBeDefined();
    component = fixture.componentInstance;

    const resultArr = component.getSrcListForMediaId('test');
    expect(resultArr).toHaveLength(testSrcsArray.length);
  })

  describe('makeCueArrayFromList',() => {
    it('should make an empty array if no param', () => {
      const arr = component.makeCueArrayFromList(null);
      expect(arr).toEqual([]);
    })
    it('should make an empty array if empty list', () => {
      const arr = component.makeCueArrayFromList(null);
      expect(arr).toEqual([]);
    })
  })
  describe('getSrcListForMediaId', () => {


    beforeEach(()=>MockBuilder(ChildComponent))
    afterEach(MockReset);

    it('should return an empty array if given a null or invalid mediaID', () =>{
      const resultArr = component.getSrcListForMediaId('');
      expect(resultArr).toHaveLength(0);
    });


  })

describe('attachCuesToMediaById', () => {

  it('should return 0 if no cues provided', () => {

    const numAttached = component.attachCuesForMediaById([], 'test');
    expect(numAttached).toBe(0);
  });

  xit('should return 0 if all cues provided are invalid', () => {
    // need to moxk VgMediaDirective and return an api
    const invalidCues: ICue[] = [
      {startTime: 0,
      endTime: 1,
      id: ''
      },
      {
        id:'valid',
        startTime: 1,
        endTime: 0
      }
    ]
    const numAttached = component.attachCuesForMediaById(invalidCues, 'test');
    expect(numAttached).toBe(0);
});

  it('should return the number of cues attached if valid cues provided', () => {
    pending();
  });

  it('should skip attaching invalid cues', () => {
    pending();
  });
});

describe('findOrAddTextForMedia', () => {
  it('should ', () => {
    // MockInstance(MediaIOService, 'getSrcListForMediaId', () => testSrcsArray);

    fixture = MockRender(ChildComponent);
    expect (fixture).toBeDefined();
    component = fixture.componentInstance;

    expect(component).toBeTruthy();
  });


});


})


