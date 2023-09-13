import { TestBed } from '@angular/core/testing';

import { BranchUpdateService } from './branch-update.service';

describe('BranchUpdateService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: BranchUpdateService = TestBed.get(BranchUpdateService);
    expect(service).toBeTruthy();
  });
});
