import { TestBed } from '@angular/core/testing';
import { StoreApiService } from './store-api.service';

describe('StoreApiService', () => {
  let service: StoreApiService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(StoreApiService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
