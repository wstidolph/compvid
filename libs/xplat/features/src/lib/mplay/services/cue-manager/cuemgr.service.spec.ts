import { CuemgrService } from "../../";

import { TestBed, ComponentFixture } from '@angular/core/testing';
import { ICue } from '../../models';
import { CueIOService } from "../cue-io/cue-io.service";


import { of } from "rxjs";

const testcuedocs: ICue[] = [{
  id: 'first',
  startTime: 0,
  endTime: 1,
  title: 'test cue'
}]

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


}); // ebircsed
