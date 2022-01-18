import { TestBed } from '@angular/core/testing';

import { CueIOService } from './cue-io.service';

describe('CueIOService', () => {
  let service: CueIOService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CueIOService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
