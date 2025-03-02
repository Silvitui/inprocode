import { TestBed } from '@angular/core/testing';


describe('TransportService', () => {
  let service: TransportService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TransportService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
