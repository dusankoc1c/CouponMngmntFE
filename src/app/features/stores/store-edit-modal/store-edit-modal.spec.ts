import { ComponentFixture, TestBed } from '@angular/core/testing';
import { StoreEditModal } from './store-edit-modal';

describe('StoreEditModal', () => {
  let component: StoreEditModal;
  let fixture: ComponentFixture<StoreEditModal>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [StoreEditModal],
    }).compileComponents();

    fixture = TestBed.createComponent(StoreEditModal);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
