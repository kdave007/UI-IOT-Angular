import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BoxPrepareComponent } from './box-prepare.component';

describe('BoxPrepareComponent', () => {
  let component: BoxPrepareComponent;
  let fixture: ComponentFixture<BoxPrepareComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BoxPrepareComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BoxPrepareComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
