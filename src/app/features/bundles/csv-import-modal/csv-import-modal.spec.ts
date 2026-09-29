import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CsvImportModal } from './csv-import-modal';

describe('CsvImportModal', () => {
  let component: CsvImportModal;
  let fixture: ComponentFixture<CsvImportModal>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CsvImportModal],
    }).compileComponents();

    fixture = TestBed.createComponent(CsvImportModal);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
