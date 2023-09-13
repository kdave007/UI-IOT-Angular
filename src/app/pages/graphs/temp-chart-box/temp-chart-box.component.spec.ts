import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TempChartBoxComponent } from './temp-chart-box.component';

describe('TempChartBoxComponent', () => {
  let component: TempChartBoxComponent;
  let fixture: ComponentFixture<TempChartBoxComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TempChartBoxComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TempChartBoxComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
