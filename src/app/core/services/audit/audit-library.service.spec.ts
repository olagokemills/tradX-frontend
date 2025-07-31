import { TestBed } from '@angular/core/testing';

import { AuditLibraryService } from './audit-library.service';

describe('AuditLibraryService', () => {
  let service: AuditLibraryService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AuditLibraryService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
