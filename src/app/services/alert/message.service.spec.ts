import { TestBed } from '@angular/core/testing';

import { ModalAlertService } from './message.service';

describe('ModalAlertService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: ModalAlertService = TestBed.get(ModalAlertService);
    expect(service).toBeTruthy();
  });
});
