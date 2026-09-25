import { ComponentFixture, TestBed } from '@angular/core/testing';
import { BundleDetail } from './bundle-detail';

describe('BundleDetail', () => {
  let component: BundleDetail;
  let fixture: ComponentFixture<BundleDetail>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BundleDetail],
    }).compileComponents();

    fixture = TestBed.createComponent(BundleDetail);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
