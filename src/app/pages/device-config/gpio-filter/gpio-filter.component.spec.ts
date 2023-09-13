import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GpioFilterComponent } from './gpio-filter.component';

describe('GpioFilterComponent', () => {
  let component: GpioFilterComponent;
  let fixture: ComponentFixture<GpioFilterComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GpioFilterComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GpioFilterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
