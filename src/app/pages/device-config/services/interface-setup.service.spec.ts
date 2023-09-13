import { TestBed } from '@angular/core/testing';

import { InterfaceSetupService } from './interface-setup.service';

describe('InterfaceSetupService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: InterfaceSetupService = TestBed.get(InterfaceSetupService);
    expect(service).toBeTruthy();
  });
});
