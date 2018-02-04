import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PasswordGenComponent } from './password-gen.component';

describe('PasswordGenComponent', () => {
  let component: PasswordGenComponent;
  let fixture: ComponentFixture<PasswordGenComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PasswordGenComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PasswordGenComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
