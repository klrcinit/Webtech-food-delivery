import { Injectable } from '@angular/core';
import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Observable } from 'rxjs';
import { finalize } from 'rxjs/operators';
import { LoadingService } from '../customer/services/loading.service';
import { catchError } from 'rxjs/operators';
import { throwError } from 'rxjs';
import { ToastService } from '../customer/services/toast.service';
import { Router } from '@angular/router';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {

  constructor(
    private loadingService: LoadingService,
    private toast: ToastService,
    private router: Router
  ) {
  }

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {

    const token = localStorage.getItem("token");

    const isAuthRequest =
      req.url.includes('/login') ||
      req.url.includes('/register');

    if (isAuthRequest) {
      return next.handle(req);
    }

    let request = req;

    if (token) {
      request = req.clone({
        setHeaders: {
          Authorization: `Bearer ${token}`
        }
      });
    }

    this.loadingService.show();

    return next.handle(request).pipe(
      catchError((error) => {
        if (error.status === 401) {
          localStorage.removeItem("token");
          this.router.navigate(['/customer/login']);
        }
        if (!isAuthRequest) {
          this.toast.show(error.error?.message || "Something went wrong");
        }
        return throwError(() => error);
      }),
      finalize(() => this.loadingService.hide())
    );
  }
}
