import { ComponentFixture, TestBed } from '@angular/core/testing';
import { StoreExportModal } from './store-export-modal';

describe('StoreExportModal', () => {
  let component: StoreExportModal;
  let fixture: ComponentFixture<StoreExportModal>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [StoreExportModal],
    }).compileComponents();

    fixture = TestBed.createComponent(StoreExportModal);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
