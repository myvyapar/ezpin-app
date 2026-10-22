import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { CryptoFinalizeComponent } from './crypto-finalize.component';

describe('CryptoFinalizeComponent', () => {
  let component: CryptoFinalizeComponent;
  let fixture: ComponentFixture<CryptoFinalizeComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ CryptoFinalizeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CryptoFinalizeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
