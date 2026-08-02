import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PromoBookCarouselComponent } from './promo-book-carousel.component';

describe('PromoBookCarouselComponent', () => {
  let component: PromoBookCarouselComponent;
  let fixture: ComponentFixture<PromoBookCarouselComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PromoBookCarouselComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PromoBookCarouselComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
