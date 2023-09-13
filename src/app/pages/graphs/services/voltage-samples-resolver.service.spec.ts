import { TestBed } from '@angular/core/testing';

import { VoltageSamplesResolverService } from './voltage-samples-resolver.service';

describe('VoltageSamplesResolverService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: VoltageSamplesResolverService = TestBed.get(VoltageSamplesResolverService);
    expect(service).toBeTruthy();
  });
});
