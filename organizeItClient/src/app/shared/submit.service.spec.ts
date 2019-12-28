import { TestBed } from '@angular/core/testing';

import { SubmitService } from './submit.service';

describe('SubmitService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: SubmitService = TestBed.get(SubmitService);
    expect(service).toBeTruthy();
  });
});
