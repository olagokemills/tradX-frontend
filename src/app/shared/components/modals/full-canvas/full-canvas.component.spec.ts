import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FullCanvasComponent } from './full-canvas.component';

describe('FullCanvasComponent', () => {
  let component: FullCanvasComponent;
  let fixture: ComponentFixture<FullCanvasComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [FullCanvasComponent]
    });
    fixture = TestBed.createComponent(FullCanvasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
