import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { v4 as uuidv4 } from 'uuid';
import { LocalStorageService } from '../storage/local-storage.service';
import { EventLog, EventType, LogToken } from '../../models/logs.model';
import { PermissionResolverService } from '../resolver/permission-resolver.service';
import { environment } from '../../../../../environments/environment';
@Injectable({
  providedIn: 'root',
})
export class RegistersService {
  private baseUrl: string = environment.baseUrl;
  constructor(
    private httpClient: HttpClient,
    private LocalStorageService: LocalStorageService,
    private permissionResolver: PermissionResolverService
  ) {}

  registerDevice(): Observable<LogToken> {
    const url = `${this.baseUrl}/services/register/`;
    const body = {
      device_id: uuidv4(),
      device_type: '1',
      model: 'browser',
      os_version: window.navigator.appVersion.substring(0, 99),
    };

    return this.httpClient.post<LogToken>(url, body);
  }

  checkDevice(): Observable<any> {
    const url = `${this.baseUrl}/services/initial/`;
    const token = this.LocalStorageService.getItem('register-token');
    const headers = new HttpHeaders().set('token', token);

    return this.httpClient.get<any>(url, { headers });
  }

  createEventLog(
    eventType: number,
    extraData?: Object,
    user?
  ): Observable<EventLog> {
    const url = `${this.baseUrl}/events/set_log/`;
    let data;
    if (eventType == EventType.LOGIN) {
      data = {
        event_type: eventType,
        user: user.username,
        region: user.region,
      };
    } else if (eventType == EventType.LOGIN_ERROR) {
      data = {
        event_type: eventType,
        extra_data: extraData,
      };
    } else {
      data = {
        event_type: eventType,
        user: this.permissionResolver.permissionInitInfo.profile.username,
        extra_data: extraData,
      };
    }

    const token = this.LocalStorageService.getItem('register-token');
    const headers = new HttpHeaders().set('token', token);
    return this.httpClient.post<EventLog>(url, data, { headers });
  }
}
