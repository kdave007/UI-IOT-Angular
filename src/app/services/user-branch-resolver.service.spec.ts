import { TestBed } from '@angular/core/testing';

import { UserBranchResolverService } from './user-branch-resolver.service';

describe('UserBranchResolverService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: UserBranchResolverService = TestBed.get(UserBranchResolverService);
    expect(service).toBeTruthy();
  });
});
