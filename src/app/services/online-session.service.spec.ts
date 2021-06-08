import { TestBed } from '@angular/core/testing';

import { OnlineSessionService } from './online-session.service';

describe('OnlineSessionService', () => {
  let service: OnlineSessionService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(OnlineSessionService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
