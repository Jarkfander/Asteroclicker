import { TestBed, inject } from '@angular/core/testing';

import { BoostService } from './boost.service';

describe('BoostService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [BoostService]
    });
  });

  it('should be created', inject([BoostService], (service: BoostService) => {
    expect(service).toBeTruthy();
  }));
});
