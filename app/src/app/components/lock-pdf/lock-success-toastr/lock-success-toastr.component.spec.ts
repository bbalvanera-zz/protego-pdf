import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LockSuccessToastrComponent } from './lock-success-toastr.component';

describe('LockSuccessToastrComponent', () => {
  let component: LockSuccessToastrComponent;
  let fixture: ComponentFixture<LockSuccessToastrComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LockSuccessToastrComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LockSuccessToastrComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
