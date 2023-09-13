import { TestBed } from '@angular/core/testing';

import { AlertsNotificationsService } from './alerts-notifications.service';

describe('AlertsNotificationsService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: AlertsNotificationsService = TestBed.get(AlertsNotificationsService);
    expect(service).toBeTruthy();
  });
});
