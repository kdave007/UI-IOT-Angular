import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { VoltagesChartComponent } from './voltages-chart.component';

describe('VoltagesChartComponent', () => {
  let component: VoltagesChartComponent;
  let fixture: ComponentFixture<VoltagesChartComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ VoltagesChartComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(VoltagesChartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
