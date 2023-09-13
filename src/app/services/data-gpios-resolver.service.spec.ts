import { TestBed } from '@angular/core/testing';

import { DataGpiosResolverService } from './data-gpios-resolver.service';

describe('DataGpiosResolverService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: DataGpiosResolverService = TestBed.get(DataGpiosResolverService);
    expect(service).toBeTruthy();
  });
});
