import { TestBed } from '@angular/core/testing';

import { ClosedEditWinService } from './closed-edit-win.service';

describe('ClosedEditWinService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: ClosedEditWinService = TestBed.get(ClosedEditWinService);
    expect(service).toBeTruthy();
  });
});
