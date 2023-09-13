import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PowerBankComponent } from './power-bank.component';

describe('PowerBankComponent', () => {
  let component: PowerBankComponent;
  let fixture: ComponentFixture<PowerBankComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PowerBankComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PowerBankComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
