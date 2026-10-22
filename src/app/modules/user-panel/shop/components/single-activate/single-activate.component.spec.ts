import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { SingleActivateComponent } from './single-activate.component';

describe('SingleActivateComponent', () => {
  let component: SingleActivateComponent;
  let fixture: ComponentFixture<SingleActivateComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ SingleActivateComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SingleActivateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
