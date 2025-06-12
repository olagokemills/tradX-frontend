import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-full-canvas',
  templateUrl: './full-canvas.component.html',
  styleUrls: ['./full-canvas.component.scss'],
})
export class FullCanvasComponent {
  @Input() customClass: string = '';
  @Input() canvasId: string = '';
  @Input() title: string = '';
}
