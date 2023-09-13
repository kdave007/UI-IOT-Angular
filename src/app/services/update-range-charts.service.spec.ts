import { TestBed } from '@angular/core/testing';

import { UpdateRangeChartsService } from './update-range-charts.service';

describe('UpdateRangeChartsService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: UpdateRangeChartsService = TestBed.get(UpdateRangeChartsService);
    expect(service).toBeTruthy();
  });
});
