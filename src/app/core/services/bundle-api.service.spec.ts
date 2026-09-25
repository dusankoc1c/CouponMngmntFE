import { TestBed } from '@angular/core/testing';
import { BundleApiService } from './bundle-api.service';

describe('BundleApiService', () => {
  let service: BundleApiService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(BundleApiService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
