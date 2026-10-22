import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { OrdersResendComponent } from './orders-resend.component';

describe('OrdersResendComponent', () => {
  let component: OrdersResendComponent;
  let fixture: ComponentFixture<OrdersResendComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ OrdersResendComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OrdersResendComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
