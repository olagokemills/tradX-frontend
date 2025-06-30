import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RemoveAuditComponent } from './remove-audit.component';

describe('RemoveAuditComponent', () => {
  let component: RemoveAuditComponent;
  let fixture: ComponentFixture<RemoveAuditComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [RemoveAuditComponent]
    });
    fixture = TestBed.createComponent(RemoveAuditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
