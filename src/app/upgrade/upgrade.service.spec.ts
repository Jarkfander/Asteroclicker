import { TestBed, inject } from '@angular/core/testing';

import { UpgradeService } from './upgrade.service';

describe('UpgradeService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [UpgradeService]
    });
  });

  it('should be created', inject([UpgradeService], (service: UpgradeService) => {
    expect(service).toBeTruthy();
  }));
});
