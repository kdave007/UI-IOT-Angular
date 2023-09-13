import { TestBed } from '@angular/core/testing';

import { CompressorActivationResolverService } from './compressor-activation-resolver.service';

describe('CompressorActivationResolverService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: CompressorActivationResolverService = TestBed.get(CompressorActivationResolverService);
    expect(service).toBeTruthy();
  });
});
