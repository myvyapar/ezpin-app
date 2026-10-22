import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { BulkActivateComponent } from './bulk-activate.component';

describe('BulkActivateComponent', () => {
  let component: BulkActivateComponent;
  let fixture: ComponentFixture<BulkActivateComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ BulkActivateComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BulkActivateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
