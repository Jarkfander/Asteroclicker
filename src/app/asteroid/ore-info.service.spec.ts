import { TestBed, inject } from '@angular/core/testing';

import { OreInfoService } from './ore-info.service';

describe('OreInfoService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [OreInfoService]
    });
  });

  it('should be created', inject([OreInfoService], (service: OreInfoService) => {
    expect(service).toBeTruthy();
  }));
});
