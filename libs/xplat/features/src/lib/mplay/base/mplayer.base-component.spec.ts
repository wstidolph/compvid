import { TestBed, ComponentFixture } from '@angular/core/testing';
import { MplayerBaseComponent } from './mplayer.base-component';
import { CueIOService, CuemgrService, MediacoordService, MediaIOService } from '../services';
import { Component, ElementRef } from '@angular/core';

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
describe('MplayerBaseComponent', () => {

  let component: ChildComponent;
  let fixture: ComponentFixture<ChildComponent>;
  beforeEach(async () => {
    TestBed.configureTestingModule({
      declarations: [ ChildComponent ]
    }).compileComponents();
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
  describe('getSrcListForMediaEd', () => {
    it('should return an empty array if given a null or invalid mediaID', () =>{
      const resultArr = component.getSrcListForMediaEd('');
      expect(resultArr).toHaveLength(0);
    });

    const testSrcsArray = [
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
    it('should return an array of sources given a mediaID', () => {
      component.getSrcListForMediaEd('test');
    })
  })



})


