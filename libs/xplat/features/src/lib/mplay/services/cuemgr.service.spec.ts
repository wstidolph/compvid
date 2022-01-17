import { CuemgrService, MplayModule } from "..";
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import { TestBed } from '@angular/core/testing';

describe('CuemgrService without Angular testing support', () => {

  let cuemgrService: CuemgrService;
  //mplayModule: typeof MplayModule;
  beforeEach(() => {
    TestBed.configureTestingModule({});
    cuemgrService = TestBed.inject(CuemgrService);
  });
  it('should construct', () => {
    expect(cuemgrService).toBeTruthy;
  })

}); // ebircsed
