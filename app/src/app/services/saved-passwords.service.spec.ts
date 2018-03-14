import { TestBed, inject } from '@angular/core/testing';

import { SavedPasswordsService } from './saved-passwords.service';

describe('SavedPasswordsService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [SavedPasswordsService]
    });
  });

  it('should be created', inject([SavedPasswordsService], (service: SavedPasswordsService) => {
    expect(service).toBeTruthy();
  }));
});
