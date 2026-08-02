import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MultiBookCarouselComponent } from './multi-book-carousel.component';

describe('MultiBookCarouselComponent', () => {
  let component: MultiBookCarouselComponent;
  let fixture: ComponentFixture<MultiBookCarouselComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MultiBookCarouselComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MultiBookCarouselComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
