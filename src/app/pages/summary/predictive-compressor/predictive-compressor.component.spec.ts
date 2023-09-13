import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PredictiveCompressorComponent } from './predictive-compressor.component';

describe('PredictiveCompressorComponent', () => {
  let component: PredictiveCompressorComponent;
  let fixture: ComponentFixture<PredictiveCompressorComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PredictiveCompressorComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PredictiveCompressorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
