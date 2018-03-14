import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PasswordsDropdownComponent } from './passwords-dropdown.component';

describe('PasswordsDropdownComponent', () => {
  let component: PasswordsDropdownComponent;
  let fixture: ComponentFixture<PasswordsDropdownComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PasswordsDropdownComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PasswordsDropdownComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
