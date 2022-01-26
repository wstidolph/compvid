import { CuemgrService } from "..";

import { TestBed, ComponentFixture } from '@angular/core/testing';
import { MockProvider, ngMocks } from 'ng-mocks';
import { CueIOService } from "./cue-io/cue-io.service";
import { TestcueComponent } from '../services/testcue/testcue.component';

// import { JSDOM } from 'jsdom';

/**
 *
 */
ngMocks.autoSpy('jest');

describe('CuemgrService without Angular testing support', () => {

  let cuemgrService: CuemgrService;
  let component: TestcueComponent; // use this to drive the service, for better DOM support
  let fixture: ComponentFixture<TestcueComponent>;

  //mplayModule: typeof MplayModule;
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        CuemgrService,
        {provide: CueIOService, useValue: MockProvider(CueIOService)}
      ],
      declarations: [ TestcueComponent ]
    });
    cuemgrService = TestBed.inject(CuemgrService);
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TestcueComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should construct', () => {
    expect(cuemgrService).toBeTruthy;
  })

  it('should make an empty array if no param', () => {
    const arr = cuemgrService.makeCueArrayFromList(null);
    expect(arr).toEqual([]);
  })
  it('should make an empty array if empty list', () => {
    const arr = cuemgrService.makeCueArrayFromList(null);
    expect(arr).toEqual([]);
  })


  it('should create', () => {
    expect(component).toBeTruthy();
  });


}); // ebircsed
