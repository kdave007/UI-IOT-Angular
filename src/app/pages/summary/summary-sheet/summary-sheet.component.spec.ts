import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SummarySheetComponent } from './summary-sheet.component';

describe('SummarySheetComponent', () => {
  let component: SummarySheetComponent;
  let fixture: ComponentFixture<SummarySheetComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SummarySheetComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SummarySheetComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
