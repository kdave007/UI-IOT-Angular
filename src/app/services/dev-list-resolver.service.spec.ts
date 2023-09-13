import { TestBed } from '@angular/core/testing';

import { DevListResolverService } from './dev-list-resolver.service';

describe('DevListResolverService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: DevListResolverService = TestBed.get(DevListResolverService);
    expect(service).toBeTruthy();
  });
});
