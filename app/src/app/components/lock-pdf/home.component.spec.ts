import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LockPdfComponent } from './home.component';

describe('HomeComponent', () => {
  let component: LockPdfComponent;
  let fixture: ComponentFixture<LockPdfComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LockPdfComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LockPdfComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
