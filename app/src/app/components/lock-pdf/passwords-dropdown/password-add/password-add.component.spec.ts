import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PasswordAddComponent } from './password-add.component';

describe('PasswordAddComponent', () => {
  let component: PasswordAddComponent;
  let fixture: ComponentFixture<PasswordAddComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PasswordAddComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PasswordAddComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
