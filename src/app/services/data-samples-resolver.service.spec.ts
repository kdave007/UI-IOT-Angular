import { TestBed } from '@angular/core/testing';

import { DataSamplesResolverService } from './data-samples-resolver.service';

describe('DataSamplesResolverService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: DataSamplesResolverService = TestBed.get(DataSamplesResolverService);
    expect(service).toBeTruthy();
  });
});
