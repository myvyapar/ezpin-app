import { Injectable } from '@angular/core';
import {
  HttpInterceptor,
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpErrorResponse,
} from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, switchMap } from 'rxjs/operators';
import { SnackBarService } from '../snack-bar.service';
import { LocalStorageService } from '../storage/local-storage.service';
import { SharedService } from '../shared.service';

@Injectable({
  providedIn: 'root',
})
export class ErrorHandlerService implements HttpInterceptor {
  refreshTokenInProgress = false;
  constructor(
    private snackBarService: SnackBarService,
    private localStorageService: LocalStorageService,
    private sharedService: SharedService
  ) {}

  intercept(
    req: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    return next.handle(req).pipe(
      catchError((error: HttpErrorResponse) => {
        let errorMsg = '';
        if (
          error.error?.code === 'token_not_valid' &&
          this.localStorageService.isLoggedIn
        ) {
          if (
            !this.refreshTokenInProgress &&
            this.localStorageService.getItem('refreshToken')
          ) {
            this.refreshTokenInProgress = true;
            let refresh = {
              refresh: this.localStorageService.getItem('refreshToken'),
            };
            return this.sharedService.refreshToken(refresh).pipe(
              switchMap((res) => {
                this.localStorageService.setItem('refreshToken', res.refresh);
                this.localStorageService.setItem('accessToken', res.access);
                this.refreshTokenInProgress = false;
                req = req.clone({
                  setHeaders: {
                    Authorization: `Bearer ${res.access}`,
                  },
                });
                return next.handle(req);
              })
            );
          } else {
            this.localStorageService.logOutUser();
          }
        }
        if (error.error instanceof ErrorEvent) {
          errorMsg = `Error: ${error.error?.message}`;
        } else {
          errorMsg = ` Error: ${error.error?.detail}`;
        }
        this.snackBarService.showSnackBar(errorMsg, 'primary', 2000);
        return throwError(error);
      })
    );
  }
}
