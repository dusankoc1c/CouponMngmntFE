import { ComponentFixture, TestBed } from '@angular/core/testing';
import { StoreAdd } from './store-add';

describe('StoreAdd', () => {
  let component: StoreAdd;
  let fixture: ComponentFixture<StoreAdd>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [StoreAdd],
    }).compileComponents();

    fixture = TestBed.createComponent(StoreAdd);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
