import { TestBed } from '@angular/core/testing';

import { LogoutCustomService } from './logout-custom.service';

describe('LogoutCustomService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: LogoutCustomService = TestBed.get(LogoutCustomService);
    expect(service).toBeTruthy();
  });
});
