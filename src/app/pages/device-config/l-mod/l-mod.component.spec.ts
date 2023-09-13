import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LModComponent } from './l-mod.component';

describe('LModComponent', () => {
  let component: LModComponent;
  let fixture: ComponentFixture<LModComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LModComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LModComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
