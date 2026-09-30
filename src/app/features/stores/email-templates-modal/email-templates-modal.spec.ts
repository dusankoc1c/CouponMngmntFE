import { ComponentFixture, TestBed } from '@angular/core/testing';
import { EmailTemplatesModal } from './email-templates-modal';

describe('EmailTemplatesModal', () => {
  let component: EmailTemplatesModal;
  let fixture: ComponentFixture<EmailTemplatesModal>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EmailTemplatesModal],
    }).compileComponents();

    fixture = TestBed.createComponent(EmailTemplatesModal);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
