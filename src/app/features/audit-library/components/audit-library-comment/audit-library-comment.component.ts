import { Component, EventEmitter, Input, Output, OnInit } from '@angular/core';
import { AuditReport } from 'src/app/shared/models/audit-report.model';

interface Comment {
  id: string;
  author: string;
  email: string;
  content: string;
  timestamp: Date;
}

@Component({
  selector: 'app-audit-library-comment',
  templateUrl: './audit-library-comment.component.html',
  styleUrls: ['./audit-library-comment.component.scss']
})
export class AuditLibraryCommentComponent implements OnInit {
  @Input() report: AuditReport | null = null;
  @Output() close = new EventEmitter<void>();

  comments: Comment[] = [];
  newComment: string = '';
  loading: boolean = false;
  currentUser = {
    name: 'Layor Salami',
    email: 'layor@gmail.com'
  };

  ngOnInit(): void {
    // Mock some initial comments if needed
    this.loadComments();
  }

  private loadComments(): void {
    // Mock comments for demonstration
    if (this.report) {
      this.comments = [
        {
          id: '1',
          author: 'Babatunde Opebi',
          email: 'babatundeope8@gmail.com',
          content: `"Update status of findings @Babatunde Opebi."`,
          timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000) // 2 hours ago
        },
        {
          id: '2',
          author: 'Babatunde Opebi',
          email: 'babatundeope8@gmail.com',
          content: `"@Babatunde Opebi Done"`,
          timestamp: new Date(Date.now() - 1 * 60 * 60 * 1000) // 1 hour ago
        }
      ];
    }
  }

  onSendComment(): void {
    if (this.newComment.trim()) {
      this.loading = true;

      // Simulate API call delay
      setTimeout(() => {
        const comment: Comment = {
          id: Date.now().toString(),
          author: this.currentUser.name,
          email: this.currentUser.email,
          content: this.newComment.trim(),
          timestamp: new Date()
        };

        this.comments.push(comment);
        this.newComment = '';
        this.loading = false;
      }, 1000); // Simulate 1 second delay
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
