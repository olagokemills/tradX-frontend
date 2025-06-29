import {
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest,
  HttpHeaders,
} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { EncryptionService } from '../utils/encryption.service';
@Injectable()
export class TokenInterceptor implements HttpInterceptor {
  constructor(private helper: EncryptionService) {}
  intercept(
    req: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    // Skip token for specific URLs
    if (
      req.url.includes('http://ip-api.com/json') ||
      req.url.includes('https://lab386.com.ng/api/v1/auth/login')
    ) {
      // Pass the request as is without any modifications
      return next.handle(req);
    }

    try {
      const userData = this.helper.GetItem('user');
      if (userData?.data?.token) {
        const token = userData.data.token;
        const headers = req.clone({
          setHeaders: {
            Authorization: `Bearer ${token}`,
          },
        });
        return next.handle(headers);
      }
    } catch (error) {
      console.error('Error accessing token:', error);
    }

    // const reqWithHead = modifiedReq.clone({
    //   setHeaders: {
    //     'Permissions-Policy':
    //       'camera=*,geolocation=*,microphone=*,autoplay=*,fullscreen=*,picture-in-picture=*,sync-xhr=*,encrypted-media=*,oversized-images=*',
    //     'Strict-Transport-Security': 'max-age=31536000; includeSubdomains',
    //     'X-Frame-Options': 'DENY',
    //     'X-Content-Type-Options': 'nosniff',
    //     'X-Xss-Protection': '1; mode=block',
    //     'Content-Security-Policy':
    //       "script-src https: 'unsafe-inline' 'unsafe-eval';style-src https: 'unsafe-inline' 'unsafe-eval';img-src https: data:;font-src https: data:;",
    //   },
    // });

    // If the request is NOT an OPTIONS request, add the custom headers

    // If it is an OPTIONS request, let it pass through unchanged

    // If no token available, proceed without authorization header
    return next.handle(req);
  }
}
