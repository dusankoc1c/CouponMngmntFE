import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Unsubscribed } from './unsubscribed';

describe('Unsubscribed', () => {
  let component: Unsubscribed;
  let fixture: ComponentFixture<Unsubscribed>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Unsubscribed],
    }).compileComponents();

    fixture = TestBed.createComponent(Unsubscribed);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
