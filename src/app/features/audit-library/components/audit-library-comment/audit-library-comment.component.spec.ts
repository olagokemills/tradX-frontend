import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AuditLibraryCommentComponent } from './audit-library-comment.component';

describe('AuditLibraryCommentComponent', () => {
  let component: AuditLibraryCommentComponent;
  let fixture: ComponentFixture<AuditLibraryCommentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AuditLibraryCommentComponent]
    })
      .compileComponents();

    fixture = TestBed.createComponent(AuditLibraryCommentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
