import { TestBed, inject } from '@angular/core/testing';

import { PdfProtectService } from './pdf-protect.service';

describe('PdfProtectService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [PdfProtectService]
    });
  });

  it('should be created', inject([PdfProtectService], (service: PdfProtectService) => {
    expect(service).toBeTruthy();
  }));
});
