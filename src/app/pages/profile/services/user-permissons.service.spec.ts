import { TestBed } from '@angular/core/testing';

import { UserPermissonsService } from './user-permissons.service';

describe('UserPermissonsService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: UserPermissonsService = TestBed.get(UserPermissonsService);
    expect(service).toBeTruthy();
  });
});
