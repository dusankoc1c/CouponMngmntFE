import { ComponentFixture, TestBed } from '@angular/core/testing';
import { BundleAddModal } from './bundle-add-modal';

describe('BundleAddModal', () => {
  let component: BundleAddModal;
  let fixture: ComponentFixture<BundleAddModal>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BundleAddModal],
    }).compileComponents();

    fixture = TestBed.createComponent(BundleAddModal);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
