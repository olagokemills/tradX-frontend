import { TestBed } from '@angular/core/testing';

import { AuditServicesService } from './audit-services.service';

describe('AuditServicesService', () => {
  let service: AuditServicesService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AuditServicesService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
