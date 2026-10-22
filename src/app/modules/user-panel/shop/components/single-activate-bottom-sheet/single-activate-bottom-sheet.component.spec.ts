import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { SingleActivateBottomSheetComponent } from './single-activate-bottom-sheet.component';

describe('SingleActivateBottomSheetComponent', () => {
  let component: SingleActivateBottomSheetComponent;
  let fixture: ComponentFixture<SingleActivateBottomSheetComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ SingleActivateBottomSheetComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SingleActivateBottomSheetComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
