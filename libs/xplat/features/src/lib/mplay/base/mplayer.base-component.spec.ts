import { TestBed, ComponentFixture } from '@angular/core/testing';
import { MplayerBaseComponent } from './mplayer.base-component';
import { CueIOService, CuemgrService, MediacoordService, MediaIOService } from '../services';
import { Component, ElementRef } from '@angular/core';
import { ngMocks, MockProvider, MockBuilder, MockRender, MockInstance, MockReset} from 'ng-mocks';
import { IMediaSource } from '../models';

/**
 * This tests the non-DOM logic to be inherited by child classes
 * (e.g., ionic, web) using a simplified test-driving ChildCOmponent
 */
@Component({
  selector: 'test-mplayer',
  template: ``,
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
  beforeEach(

    () => {
    // TestBed.configureTestingModule({
    //   declarations: [ ChildComponent ],
    //   providers: [
    //     MockProvider(MediaIOService)
    //   ]
    // }).compileComponents();
    TestBed.configureTestingModule(
      ngMocks.guts(
        ChildComponent,
        [CueIOService, CuemgrService, MediaIOService, MediacoordService]
      )
    )
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ChildComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

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

    beforeEach(()=>MockBuilder(ChildComponent))
    beforeAll(()=>{
      MockInstance(MediaIOService, {
        init:instance => {
          instance.getSrcListForMediaId = () => testSrcsArray;
        }
      })
    });

    afterAll(MockReset);
    it('should return an empty array if given a null or invalid mediaID', () =>{
      const resultArr = component.getSrcListForMediaId('');
      expect(resultArr).toHaveLength(0);
    });

    it('should return an array of sources given a mediaID', () => {
      const resultArr = component.getSrcListForMediaId('test');
      expect(resultArr).toHaveLength(testSrcsArray.length);
    })
  })



})


