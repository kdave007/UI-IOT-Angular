import { TestBed } from '@angular/core/testing';

import { PowerBankResolverService } from './power-bank-resolver.service';

describe('PowerBankResolverService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: PowerBankResolverService = TestBed.get(PowerBankResolverService);
    expect(service).toBeTruthy();
  });
});
