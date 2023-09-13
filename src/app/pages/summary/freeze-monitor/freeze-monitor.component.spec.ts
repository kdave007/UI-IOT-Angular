import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FreezeMonitorComponent } from './freeze-monitor.component';

describe('FreezeMonitorComponent', () => {
  let component: FreezeMonitorComponent;
  let fixture: ComponentFixture<FreezeMonitorComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FreezeMonitorComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FreezeMonitorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
