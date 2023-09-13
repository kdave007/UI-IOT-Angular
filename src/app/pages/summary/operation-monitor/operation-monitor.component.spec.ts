import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OperationMonitorComponent } from './operation-monitor.component';

describe('OperationMonitorComponent', () => {
  let component: OperationMonitorComponent;
  let fixture: ComponentFixture<OperationMonitorComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OperationMonitorComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OperationMonitorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
