import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Server } from './../models/server.model';
import { UrlBuilderService } from 'src/app/modules/shared/services/url-builder.service';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class LoginService {
  constructor(
    private http: HttpClient,
    private urlBuilder: UrlBuilderService
  ) {}

  userLogin(user): Observable<any> {
    let url = this.urlBuilder.urlBuild('auth', 'web-login');
    return this.http.post(url, user);
  }

  userLoginStepTwo(user: any): Observable<any> {
    let url = this.urlBuilder.urlBuild('auth', 'web-login', 'step-two');
    return this.http.post(url, user)
  }

  userLoginStepThree(user: any): Observable<any> {
    let url = this.urlBuilder.urlBuild('auth', 'web-login', 'step-three');
    return this.http.post(url, user)
  }

  forgetPassword(email): Observable<any> {
    let url =
      'https://api.ezpaypin.com/api/v1/customers/account-recovery/forget-password/';
    return this.http.post(url, email);
  }

  getServerList(): Observable<Server[]> {
    const url = `${environment.baseUrl}/services/regions/`;
    return this.http.get<Server[]>(url);
  }
}
