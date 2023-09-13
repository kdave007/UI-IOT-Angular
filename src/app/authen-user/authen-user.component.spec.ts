import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AuthenUserComponent } from './authen-user.component';

describe('AuthenUserComponent', () => {
  let component: AuthenUserComponent;
  let fixture: ComponentFixture<AuthenUserComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AuthenUserComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AuthenUserComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
