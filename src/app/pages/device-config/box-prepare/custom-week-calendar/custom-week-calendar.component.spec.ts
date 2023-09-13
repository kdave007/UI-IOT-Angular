import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CustomWeekCalendarComponent } from './custom-week-calendar.component';

describe('CustomWeekCalendarComponent', () => {
  let component: CustomWeekCalendarComponent;
  let fixture: ComponentFixture<CustomWeekCalendarComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CustomWeekCalendarComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CustomWeekCalendarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
