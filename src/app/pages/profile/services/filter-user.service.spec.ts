import { TestBed } from '@angular/core/testing';

import { FilterUserService } from './filter-user.service';

describe('FilterUserService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: FilterUserService = TestBed.get(FilterUserService);
    expect(service).toBeTruthy();
  });
});
