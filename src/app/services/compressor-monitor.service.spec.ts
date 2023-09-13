import { TestBed } from '@angular/core/testing';

import { CompressorMonitorService } from './compressor-monitor.service';

describe('CompressorMonitorService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: CompressorMonitorService = TestBed.get(CompressorMonitorService);
    expect(service).toBeTruthy();
  });
});
