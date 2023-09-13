import { TestBed } from '@angular/core/testing';

import { DevicesDataService } from './devices-data.service';

describe('DevicesDataService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: DevicesDataService = TestBed.get(DevicesDataService);
    expect(service).toBeTruthy();
  });
});
