import { Injectable } from '@angular/core';
import {
  HttpInterceptor,
  HttpRequest,
  HttpHandler,
  HttpEvent,
} from '@angular/common/http';
import { Observable } from 'rxjs';
import { finalize, tap } from 'rxjs/operators';
import { LocalStorageService } from '../storage/local-storage.service';
import { StateService } from '../storage/state.service';

@Injectable({
  providedIn: 'root',
})
export class HttpInterceptorService implements HttpInterceptor {
  constructor(
    private localStorageService: LocalStorageService,
    private stateService: StateService
  ) {}

  intercept(
    req: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    this.stateService.startLoading();
    let localToken = this.localStorageService.getItem('accessToken');
    if (localToken) {
      req = req.clone({
        setHeaders: {
          Authorization: `Bearer ${localToken}`,
        },
      });
    }

    return next.handle(req).pipe(
      tap((event) => {}),
      finalize(() => {
        this.stateService.endLoading();
      })
    );
  }
}
