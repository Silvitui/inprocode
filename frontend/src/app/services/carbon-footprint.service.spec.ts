import { TestBed } from '@angular/core/testing';

import { CarbonFootprintService } from './carbon-footprint.service';

describe('CarbonFootprintService', () => {
  let service: CarbonFootprintService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CarbonFootprintService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
