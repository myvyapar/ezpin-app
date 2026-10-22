import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { ExchangeProcessComponent } from './exchange-process.component';

describe('ExchangeProcessComponent', () => {
  let component: ExchangeProcessComponent;
  let fixture: ComponentFixture<ExchangeProcessComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ ExchangeProcessComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ExchangeProcessComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
