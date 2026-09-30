import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AdminEditModal } from './admin-edit-modal';

describe('AdminEditModal', () => {
  let component: AdminEditModal;
  let fixture: ComponentFixture<AdminEditModal>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AdminEditModal],
    }).compileComponents();

    fixture = TestBed.createComponent(AdminEditModal);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
