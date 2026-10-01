import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ExportAllModal } from './export-all-modal';

describe('ExportAllModal', () => {
  let component: ExportAllModal;
  let fixture: ComponentFixture<ExportAllModal>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ExportAllModal],
    }).compileComponents();

    fixture = TestBed.createComponent(ExportAllModal);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
