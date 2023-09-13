import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ExternalSourceComponent } from './external-source.component';

describe('ExternalSourceComponent', () => {
  let component: ExternalSourceComponent;
  let fixture: ComponentFixture<ExternalSourceComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ExternalSourceComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ExternalSourceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
