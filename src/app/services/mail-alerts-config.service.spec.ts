import { TestBed } from '@angular/core/testing';

import { MailAlertsConfigService } from './mail-alerts-config.service';

describe('MailAlertsConfigService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: MailAlertsConfigService = TestBed.get(MailAlertsConfigService);
    expect(service).toBeTruthy();
  });
});
