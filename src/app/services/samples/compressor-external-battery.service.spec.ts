import { TestBed } from '@angular/core/testing';

import { CompressorExternalBatteryService } from './compressor-external-battery.service';

describe('CompressorExternalBatteryService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: CompressorExternalBatteryService = TestBed.get(CompressorExternalBatteryService);
    expect(service).toBeTruthy();
  });
});
