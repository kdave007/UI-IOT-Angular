import { TestBed } from '@angular/core/testing';

import { UpdateUserInfoService } from './update-user-info.service';

describe('UpdateUserInfoService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: UpdateUserInfoService = TestBed.get(UpdateUserInfoService);
    expect(service).toBeTruthy();
  });
});
