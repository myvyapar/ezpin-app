import { TestBed } from '@angular/core/testing';

import { PermissionResolverService } from './permission-resolver.service';

describe('PermissionResolverService', () => {
  let service: PermissionResolverService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PermissionResolverService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
