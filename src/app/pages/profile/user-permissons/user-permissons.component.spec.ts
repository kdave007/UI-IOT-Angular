import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UserPermissonsComponent } from './user-permissons.component';

describe('UserPermissonsComponent', () => {
  let component: UserPermissonsComponent;
  let fixture: ComponentFixture<UserPermissonsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UserPermissonsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UserPermissonsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
