import { TestBed } from '@angular/core/testing';

import { FreezeMonitorResolverService } from './freeze-monitor-resolver.service';

describe('FreezeMonitorResolverService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: FreezeMonitorResolverService = TestBed.get(FreezeMonitorResolverService);
    expect(service).toBeTruthy();
  });
});
