import { TestBed } from '@angular/core/testing';

import { CompressorGpioService } from './compressor-gpio.service';

describe('CompressorGpioService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: CompressorGpioService = TestBed.get(CompressorGpioService);
    expect(service).toBeTruthy();
  });
});
