import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DeviceNotificationsComponent } from './device-notifications.component';

describe('DeviceNotificationsComponent', () => {
  let component: DeviceNotificationsComponent;
  let fixture: ComponentFixture<DeviceNotificationsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DeviceNotificationsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DeviceNotificationsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
