import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GpiosChartComponent } from './gpios-chart.component';

describe('GpiosChartComponent', () => {
  let component: GpiosChartComponent;
  let fixture: ComponentFixture<GpiosChartComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GpiosChartComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GpiosChartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
