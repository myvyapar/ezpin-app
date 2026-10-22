import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { UrlBuilderService } from './url-builder.service';
import { Permission } from '../models/permission.model';

@Injectable({ providedIn: 'root' })

export class SharedService {

    constructor(private http: HttpClient, private urlService: UrlBuilderService) { }

    getUserPermissions(): Observable<Permission> {
        const url = this.urlService.urlBuild('customers', 'initial');
        return this.http.get<Permission>(url);
    }

    refreshToken(params):Observable<any>{
        const url = this.urlService.urlBuild('auth','token','refresh')
        return this.http.post<any>(url,params);
    }
}
