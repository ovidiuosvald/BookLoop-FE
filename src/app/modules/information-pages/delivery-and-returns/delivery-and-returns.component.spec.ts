import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DeliveryAndReturnsComponent } from './delivery-and-returns.component';

describe('DeliveryAndReturnsComponent', () => {
  let component: DeliveryAndReturnsComponent;
  let fixture: ComponentFixture<DeliveryAndReturnsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DeliveryAndReturnsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DeliveryAndReturnsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
