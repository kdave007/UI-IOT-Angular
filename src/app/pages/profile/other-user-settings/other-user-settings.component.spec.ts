import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OtherUserSettingsComponent } from './other-user-settings.component';

describe('OtherUserSettingsComponent', () => {
  let component: OtherUserSettingsComponent;
  let fixture: ComponentFixture<OtherUserSettingsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OtherUserSettingsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OtherUserSettingsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
