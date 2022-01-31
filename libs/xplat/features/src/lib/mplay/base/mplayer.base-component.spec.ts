import { TestBed, ComponentFixture } from '@angular/core/testing';
import { MplayerBaseComponent } from './mplayer.base-component';
import { CuemgrService, MediacoordService } from '../services';
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
    public cmgrsvc: CuemgrService) {
    super(ref, mcsvc, cmgrsvc);
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


  it('should make an empty array if no param', () => {
    const arr = component.makeCueArrayFromList(null);
    expect(arr).toEqual([]);
  })
  it('should make an empty array if empty list', () => {
    const arr = component.makeCueArrayFromList(null);
    expect(arr).toEqual([]);
  })


})


