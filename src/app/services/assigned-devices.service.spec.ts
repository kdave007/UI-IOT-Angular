import { TestBed } from '@angular/core/testing';

import { AssignedDevicesService } from './assigned-devices.service';

describe('AssignedDevicesService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: AssignedDevicesService = TestBed.get(AssignedDevicesService);
    expect(service).toBeTruthy();
  });
});
