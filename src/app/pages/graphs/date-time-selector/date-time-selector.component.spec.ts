import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DateTimeSelectorComponent } from './date-time-selector.component';

describe('DateTimeSelectorComponent', () => {
  let component: DateTimeSelectorComponent;
  let fixture: ComponentFixture<DateTimeSelectorComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DateTimeSelectorComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DateTimeSelectorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
