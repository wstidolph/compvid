import { TestBed } from '@angular/core/testing';
import { Firestore } from '@angular/fire/firestore';
import { mockFirebase } from 'firestore-jest-mock';
import { FakeFirestore, mockCollection, mockDoc} from 'firestore-jest-mock/mocks/firestore'
// import { getDocs } from 'firebase/firestore';

import { CueIOService } from './cue-io.service';

describe('CueIOService', () => {
  let service: CueIOService;

  beforeEach(() => {
    jest.resetModules();
    jest.resetAllMocks();


    TestBed.configureTestingModule({});
    service = TestBed.inject(CueIOService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
