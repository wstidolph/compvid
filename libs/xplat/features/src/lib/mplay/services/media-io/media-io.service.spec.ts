import { TestBed } from '@angular/core/testing';

import { MediaIOService } from './media-io.service';

describe('MediaIOService', () => {
  let service: MediaIOService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MediaIOService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
