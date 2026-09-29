import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CouponAddModal } from './coupon-add-modal';

describe('CouponAddModal', () => {
  let component: CouponAddModal;
  let fixture: ComponentFixture<CouponAddModal>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CouponAddModal],
    }).compileComponents();

    fixture = TestBed.createComponent(CouponAddModal);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
