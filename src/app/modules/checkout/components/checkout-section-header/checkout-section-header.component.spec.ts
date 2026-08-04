import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CheckoutSectionHeaderComponent } from './checkout-section-header.component';

describe('CheckoutSectionHeaderComponent', () => {
  let component: CheckoutSectionHeaderComponent;
  let fixture: ComponentFixture<CheckoutSectionHeaderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CheckoutSectionHeaderComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CheckoutSectionHeaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
