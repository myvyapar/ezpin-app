import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { SharedService } from '../shared.service'
import {Permission} from './../../models/permission.model';

@Injectable({
  providedIn: 'root'
})
export class PermissionResolverService {
  private resolvedInfo: Permission;

  public constructor(
      private sharedService: SharedService
  ) { }

  private resolveInfo(): Promise<any> {
      return new Promise<void>((resolve, reject) => {
          this.sharedService.getUserPermissions().subscribe(
              data => {
                  this.permissionInitInfo = data;
                  resolve();
              }, error => {
                  reject();
              }
          )
      })
  }

  get permissionInitInfo() {
      return this.resolvedInfo;
  }

  set permissionInitInfo(info) {
      this.resolvedInfo = info;
  }

  public updateInfo() {
      this.resolveInfo();
  }

  public resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Promise<any> {
      return this.resolveInfo();
  }
}
