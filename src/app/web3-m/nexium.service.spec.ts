import { TestBed, inject } from '@angular/core/testing';

import { NexiumService } from './nexium.service';

describe('NexiumService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [NexiumService]
    });
  });

  it('should be created', inject([NexiumService], (service: NexiumService) => {
    expect(service).toBeTruthy();
  }));
});
