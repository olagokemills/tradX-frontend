import {
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest,
  HttpHeaders,
} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable()
export class TokenInterceptor implements HttpInterceptor {
  intercept(
    req: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    if (req.method)
      if (req.url.includes('http://ip-api.com/json')) {
        // Pass the request as is without any modifications
        return next.handle(req);
      }

    if (
      req.url.includes('https://api.getmati.com/v2') ||
      (req.url.includes('https://api.prod.metamap.com/v2') &&
        !req.url.includes('https://api.getmati.com/oauth'))
    ) {
      const sesh = sessionStorage.getItem('token') ?? '';
      const headers = req.clone({
        setHeaders: {
          Authorization: `Bearer ${sesh}`,
          Accept: '*/*',
        },
      });
      return next.handle(headers);
    }
    if (
      req.method !== 'OPTIONS' &&
      req.url ===
        'https://openaccounts2.firstbanknigeria.com/damapi/api/v1/verifyID'
    ) {
      const headers = req.headers
        .set('AppId', 'Web')
        .set('AppKey', 'cbwid9wbdw9db9bb9wd9b093');
      const modifiedReq = req.clone({ headers });

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

      return next.handle(modifiedReq);
    }
    // If the request is NOT an OPTIONS request, add the custom headers
    if (
      req.method !== 'OPTIONS' &&
      !req.url.includes('https://api.getmati.com/v2') &&
      !req.url.includes('https://api.prod.metamap.com/v2') &&
      !req.url.includes('https://api.getmati.com/oauth')
    ) {
      const headers = req.headers
        .set('AppId', 'Web')
        .set(
          'AppKey',
          'SU7hIrDmnbXPLJ41w4tKdh8wtbE187HHc2ttUxgFKpy+JFOL7umENj3jCNXAFYEH'
        );
      const modifiedReq = req.clone({ headers });

      const reqWithHead = modifiedReq.clone({
        setHeaders: {
          'Permissions-Policy':
            'camera=*,geolocation=*,microphone=*,autoplay=*,fullscreen=*,picture-in-picture=*,sync-xhr=*,encrypted-media=*,oversized-images=*',
          'Strict-Transport-Security': 'max-age=31536000; includeSubdomains',
          'X-Frame-Options': 'DENY',
          'X-Content-Type-Options': 'nosniff',
          'X-Xss-Protection': '1; mode=block',
          'Content-Security-Policy':
            "script-src https: 'unsafe-inline' 'unsafe-eval';style-src https: 'unsafe-inline' 'unsafe-eval';img-src https: data:;font-src https: data:;",
        },
      });
      return next.handle(reqWithHead);
    }

    // If it is an OPTIONS request, let it pass through unchanged
    return next.handle(req);
  }
}
