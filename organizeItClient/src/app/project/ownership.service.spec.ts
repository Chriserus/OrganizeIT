import {TestBed} from '@angular/core/testing';

import {OwnershipService} from './ownership.service';

describe('OwnershipService', () => {
    beforeEach(() => TestBed.configureTestingModule({}));

    it('should be created', () => {
        const service: OwnershipService = TestBed.get(OwnershipService);
        expect(service).toBeTruthy();
    });
});
