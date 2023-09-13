import { TestBed } from '@angular/core/testing';

import { ChartViewService } from './chart-view.service';

describe('ChartViewService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: ChartViewService = TestBed.get(ChartViewService);
    expect(service).toBeTruthy();
  });
});
