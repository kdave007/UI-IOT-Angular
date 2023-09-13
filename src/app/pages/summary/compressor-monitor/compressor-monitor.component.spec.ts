import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CompressorMonitorComponent } from './compressor-monitor.component';

describe('CompressorMonitorComponent', () => {
  let component: CompressorMonitorComponent;
  let fixture: ComponentFixture<CompressorMonitorComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CompressorMonitorComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CompressorMonitorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
