import { TestBed } from '@angular/core/testing';
import { CanActivateFn } from '@angular/router';

import { teamleaderGuard } from './teamleader.guard';

describe('teamleaderGuard', () => {
  const executeGuard: CanActivateFn = (...guardParameters) => 
      TestBed.runInInjectionContext(() => teamleaderGuard(...guardParameters));

  beforeEach(() => {
    TestBed.configureTestingModule({});
  });

  it('should be created', () => {
    expect(executeGuard).toBeTruthy();
  });
});
