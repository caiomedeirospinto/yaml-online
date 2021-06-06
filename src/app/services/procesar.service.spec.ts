import { TestBed } from '@angular/core/testing';

import { ProcesarService } from './procesar.service';

describe('ProcesarService', () => {
  let service: ProcesarService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ProcesarService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
