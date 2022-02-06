import { CuemgrService } from "../../";

import { TestBed, ComponentFixture } from '@angular/core/testing';
import { ICue } from '../../models';
import { CueIOService } from "../cue-io/cue-io.service";
import testdata from '../../cueTestData.json'

import { of } from "rxjs";

const testcuedocs: ICue[] = testdata.cues;

const cueIoSvc = new CueIOService();
const CueIOServiceMock = jest.mock('./cue-io/cue-io.service');

describe('CuemgrService without Angular testing support', () => {

  let cuemgrService: CuemgrService;
  let cueMgrServiceMock: jest.Mock<CueIOService>;

  beforeEach(()=> {
    jest.resetAllMocks();
  })
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        CuemgrService
      ]
    });
  });

  beforeEach(() => {
    cuemgrService = TestBed.inject(CuemgrService);
  });

  it('should construct', () => {
    expect(cuemgrService).toBeTruthy;
  })

  it('should have 2 test cues', () => {
    expect(testcuedocs).toHaveLength(2);
  })


}); // ebircsed
