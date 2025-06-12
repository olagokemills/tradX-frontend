import { Injectable } from '@angular/core';
import {
  HttpInterceptor,
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpErrorResponse,
} from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Router } from '@angular/router';
import { GenericService } from '../utils/generic-service.service';

@Injectable({
  providedIn: 'root',
})
export class ErrorHandlerService implements HttpInterceptor {
  constructor(private router: Router, private gVars: GenericService) {}

  intercept(
    request: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    return next.handle(request).pipe(
      catchError((error: HttpErrorResponse) => {
        this.gVars.spinner.hide();
        this.handleError(error);
        return throwError(() => error); // Re-throw the error so components can handle it if needed
      })
    );
  }

  private handleError(error: HttpErrorResponse) {
    this.gVars.spinner.hide();
    if (error.error instanceof ErrorEvent) {
      // Client-side error
      console.error('Client-side error:', error.error.message);
      this.showNotification('An unexpected error occurred. Please try again.');
    } else {
      // Server-side error
      console.error('Server-side error:', error);

      switch (error.status) {
        case 0: // Network error
          this.showNotification('Network error. Please check your connection.');
          break;
        case 400: // Bad Request
          this.showNotification('Invalid request. Please check your inputs.');
          break;
        case 401: // Unauthorized
          this.showNotification('You are not authorized. Please log in again.');
          this.router.navigate(['/login']);
          break;
        case 403: // Forbidden
          this.showNotification(
            'Access denied. You do not have permission to perform this action.'
          );
          break;
        case 404: // Not Found
          this.showNotification('The requested resource was not found.');
          break;
        case 500: // Internal Server Error
          this.showNotification('Server error. Please try again later.');
          break;
        default:
          this.showNotification(
            'An unexpected error occurred. Please try again.'
          );
          this.gVars.spinner.hide();
      }
    }
  }

  private showNotification(message: string) {
    this.gVars.toastr.error(message, 'An error occurred');
  }
}
