import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ThermistorCalComponent } from './thermistor-cal.component';

describe('ThermistorCalComponent', () => {
  let component: ThermistorCalComponent;
  let fixture: ComponentFixture<ThermistorCalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ThermistorCalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ThermistorCalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
