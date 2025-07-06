import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Finding } from '../../../models/finding.model';

@Component({
  selector: 'app-view-finding-dialog',
  template: `
    <h2 mat-dialog-title>Finding Details</h2>
    <mat-dialog-content>
      <div class="finding-details">
        <div class="detail-row">
          <label>Finding ID:</label>
          <span>#{{ data.finding.id }}</span>
        </div>
        <div class="detail-row">
          <label>Closure Date:</label>
          <span>{{ data.finding.closureDate | date:'dd MMMM yyyy' }}</span>
        </div>
        <div class="detail-row">
          <label>Priority:</label>
          <span [class]="'priority-badge ' + data.finding.priority.toLowerCase()">
            {{ data.finding.priority }}
          </span>
        </div>
        <div class="detail-row">
          <label>Title:</label>
          <span>{{ data.finding.title }}</span>
        </div>
        <div class="detail-row">
          <label>Category:</label>
          <span>{{ data.finding.category }}</span>
        </div>
        <div class="detail-row">
          <label>Status:</label>
          <span [class]="'status-badge ' + data.finding.status.toLowerCase()">
            <i class="bi bi-circle-fill"></i>
            {{ data.finding.status }}
          </span>
        </div>
        <div class="detail-row">
          <label>Description:</label>
          <p>{{ data.finding.description }}</p>
        </div>
        <div class="detail-row">
          <label>Recommendation:</label>
          <p>{{ data.finding.recommendation }}</p>
        </div>
      </div>
    </mat-dialog-content>
    <mat-dialog-actions align="end">
      <button mat-button mat-dialog-close>Close</button>
    </mat-dialog-actions>
  `,
  styles: [`
    .finding-details {
      padding: 1rem;
    }
    .detail-row {
      margin-bottom: 1rem;
    }
    .detail-row label {
      font-weight: 500;
      margin-right: 1rem;
      min-width: 120px;
      display: inline-block;
    }
    .detail-row p {
      margin-top: 0.5rem;
      white-space: pre-wrap;
    }
  `]
})
export class ViewFindingDialogComponent {
  constructor(@Inject(MAT_DIALOG_DATA) public data: { finding: Finding }) { }
}
