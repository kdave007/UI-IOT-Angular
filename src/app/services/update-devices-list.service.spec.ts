import { TestBed } from '@angular/core/testing';

import { UpdateDevicesListService } from './update-devices-list.service';

describe('UpdateDevicesListService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: UpdateDevicesListService = TestBed.get(UpdateDevicesListService);
    expect(service).toBeTruthy();
  });
});
