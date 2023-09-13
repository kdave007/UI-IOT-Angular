import { TestBed } from '@angular/core/testing';

import { AlarmsService } from './alarms.service';

describe('AlarmsService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: AlarmsService = TestBed.get(AlarmsService);
    expect(service).toBeTruthy();
  });
});
