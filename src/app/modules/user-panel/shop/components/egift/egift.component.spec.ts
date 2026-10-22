import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { EgiftComponent } from './egift.component';

describe('EgiftComponent', () => {
  let component: EgiftComponent;
  let fixture: ComponentFixture<EgiftComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ EgiftComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EgiftComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
