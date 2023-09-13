import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RegistrationDeviceComponent } from './registration-device.component';

describe('RegistrationDeviceComponent', () => {
  let component: RegistrationDeviceComponent;
  let fixture: ComponentFixture<RegistrationDeviceComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RegistrationDeviceComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RegistrationDeviceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
