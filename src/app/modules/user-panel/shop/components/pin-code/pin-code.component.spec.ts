import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { PinCodeComponent } from './pin-code.component';

describe('PinCodeComponent', () => {
  let component: PinCodeComponent;
  let fixture: ComponentFixture<PinCodeComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ PinCodeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PinCodeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
