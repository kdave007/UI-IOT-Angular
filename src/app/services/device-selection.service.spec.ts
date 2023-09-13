import { TestBed } from '@angular/core/testing';

import { DeviceSelectionService } from './device-selection.service';

describe('DeviceSelectionService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: DeviceSelectionService = TestBed.get(DeviceSelectionService);
    expect(service).toBeTruthy();
  });
});
