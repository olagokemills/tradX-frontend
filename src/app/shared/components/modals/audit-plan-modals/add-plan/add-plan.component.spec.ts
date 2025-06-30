import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddPlanComponent } from './add-plan.component';

describe('AddPlanComponent', () => {
  let component: AddPlanComponent;
  let fixture: ComponentFixture<AddPlanComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AddPlanComponent]
    });
    fixture = TestBed.createComponent(AddPlanComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
