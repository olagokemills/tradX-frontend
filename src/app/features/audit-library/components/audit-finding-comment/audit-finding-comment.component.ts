import { Component, EventEmitter, Input, Output, OnInit, OnChanges, SimpleChanges } from '@angular/core';
import { AuditFindingsService } from 'src/app/core/services/audit/audit-findings.service';
import { Finding } from 'src/app/shared/models/finding.model';

interface Comment {
  id: string;
  author: string;
  email: string;
  content: string;
  timestamp: Date;
}

@Component({
  selector: 'app-audit-finding-comment',
  templateUrl: './audit-finding-comment.component.html',
  styleUrls: ['./audit-finding-comment.component.scss']
})
export class AuditFindingCommentComponent implements OnInit, OnChanges {
  @Input() finding: any | null = null;
  @Output() close = new EventEmitter<void>();

  comments: Comment[] = [];
  newComment: string = '';
  loading: boolean = false;
  currentUser = {
    name: 'Current User',
    email: 'user@example.com'
  };

  constructor(
    private auditFindingsService: AuditFindingsService
  ) { }

  ngOnInit(): void {
    // Load comments for this finding
    if (this.finding) {
      this.loadComments();
    }
  }

  ngOnChanges(changes: SimpleChanges): void {
    // Check if finding input has changed and is not the first change
    if (changes['finding'] && this.finding) {
      this.loadComments();
    }
  }

  private loadComments(): void {
    this.loading = true;

    // Get organizationId from the finding or use default
    const organizationId = this.finding.organizationId || localStorage.getItem('organizationId') as string;

    // Get reportId if it exists on the finding
    const reportId = this.finding.auditReportId || '';

    // Call API to get comments - we don't need auditFindingId for loading comments
    this.auditFindingsService.GetAuditFindingComments({
      organizationId: organizationId,
      reportId: this.finding.auditFindingId,
      pageNumber: 1,
      pageSize: 50  // Get a reasonable number of comments
    }).subscribe({
      next: (response) => {
        if (response.isSuccess && response.data) {
          // Map API response to Comment interface
          this.comments = response.data.map((comment: any) => ({
            id: comment.id || comment.commentId,
            author: comment.author || comment.userName || 'Unknown User',
            email: comment.email || comment.userEmail || '',
            content: comment.content || comment.comment || '',
            timestamp: new Date(comment.timestamp || comment.createdAt)
          }));
        } else {
          console.error('Failed to load comments:', response.errorMessage);
          // Show error using toastr if available
          const toastrService = (window as any).toastr;
          if (toastrService) {
            toastrService.error(response.errorMessage || 'Failed to load comments');
          }
          // Fallback to empty comments array
          this.comments = [];
        }
        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading comments:', error);
        // Show error using toastr if available
        const toastrService = (window as any).toastr;
        if (toastrService) {
          toastrService.error('Failed to load comments');
        }
        // Fallback to empty comments array
        this.comments = [];
        this.loading = false;
      }
    });
  }

  onSendComment(): void {
    if (this.newComment.trim()) {
      this.loading = true;

      // Get auditFindingId from the finding
      const auditFindingId = this.finding.auditFindingId || this.finding.id;

      // Add the comment via service
      this.auditFindingsService.AddAuditFindingComment({
        organizationId: this.finding.organizationId,
        auditFindingId: auditFindingId,
        comment: this.newComment.trim()
      }).subscribe({
        next: (response) => {
          if (response.isSuccess) {
            // Add comment to local list for immediate display
            const comment: Comment = {
              id: Date.now().toString(),
              author: this.currentUser.name,
              email: this.currentUser.email,
              content: this.newComment.trim(),
              timestamp: new Date()
            };

            this.comments.push(comment);
            this.newComment = '';
            // Show success message
            const toastrService = (window as any).toastr;
            if (toastrService) {
              toastrService.success('Comment added successfully');
            }
          } else {
            // Show error message
            const toastrService = (window as any).toastr;
            if (toastrService) {
              toastrService.error(response.errorMessage || 'Failed to add comment');
            }
          }
          this.loading = false;
        },
        error: (error) => {
          console.error('Error adding comment:', error);
          // Show error message
          const toastrService = (window as any).toastr;
          if (toastrService) {
            toastrService.error('Failed to add comment');
          }
          this.loading = false;
        }
      });
    }
  }

  onTextareaKeydown(event: KeyboardEvent): void {
    if (event.ctrlKey && event.key === 'Enter') {
      this.onSendComment();
    }
  }

  onClose(): void {
    this.close.emit();
  }

  formatTimestamp(timestamp: Date): string {
    const now = new Date();
    const diffInMs = now.getTime() - timestamp.getTime();
    const diffInMinutes = Math.floor(diffInMs / (1000 * 60));
    const diffInHours = Math.floor(diffInMinutes / 60);
    const diffInDays = Math.floor(diffInHours / 24);

    if (diffInMinutes < 1) {
      return 'Just now';
    } else if (diffInMinutes < 60) {
      return `${diffInMinutes} minute${diffInMinutes > 1 ? 's' : ''} ago`;
    } else if (diffInHours < 24) {
      return `${diffInHours} hour${diffInHours > 1 ? 's' : ''} ago`;
    } else {
      return `${diffInDays} day${diffInDays > 1 ? 's' : ''} ago`;
    }
  }

  getAuthorInitials(authorName: string): string {
    return authorName
      .split(' ')
      .map(name => name.charAt(0))
      .join('')
      .toUpperCase()
      .substring(0, 2);
  }
}
