import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TestcueComponent } from './testcue.component';

describe('TestcueComponent', () => {
  let component: TestcueComponent;
  let fixture: ComponentFixture<TestcueComponent>;

  beforeEach(async () => {
    TestBed.configureTestingModule({
      declarations: [ TestcueComponent ]
    });
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TestcueComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create, with injected service', () => {
    expect(component).toBeTruthy();
    expect(component.cuemgrSvc).toBeTruthy();
  });

  it('BROKEN - should understand TestTrack', () => {
    const myElement: HTMLElement = fixture.nativeElement;
    const v = myElement.querySelector('video');
    expect(v).toBeTruthy();
    // runing the test inside event handler is silly, the test suit eis over
    // by the time the handler runs!
    // v!.addEventListener("loadedmetadata", function() {
    //   const t = v!.addTextTrack('metadata');
    //   const c = t.addCue(new VTTCue(0,0.1,'hi'));

    //   const cl = t.cues;
    //   expect(cl!.length).toEqual(1);
    // })


  });
});
