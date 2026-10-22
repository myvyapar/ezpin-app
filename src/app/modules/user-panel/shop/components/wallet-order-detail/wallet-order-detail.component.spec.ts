import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { WalletOrderDetailComponent } from './wallet-order-detail.component';

describe('WalletOrderDetailComponent', () => {
  let component: WalletOrderDetailComponent;
  let fixture: ComponentFixture<WalletOrderDetailComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ WalletOrderDetailComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WalletOrderDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
