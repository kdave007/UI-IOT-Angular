import { TestBed } from '@angular/core/testing';

import { TempCalibrationSamplesService } from './temp-calibration-samples.service';

describe('TempCalibrationSamplesService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: TempCalibrationSamplesService = TestBed.get(TempCalibrationSamplesService);
    expect(service).toBeTruthy();
  });
});
