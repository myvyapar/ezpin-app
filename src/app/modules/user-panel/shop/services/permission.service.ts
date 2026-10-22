import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { PermissionResolverService } from 'src/app/modules/shared/services/resolver/permission-resolver.service';
import { StateService } from 'src/app/modules/shared/services/storage/state.service';

@Injectable({
  providedIn: 'root',
})
export class PermissionService {
  permissions;
  isSubUser: boolean;
  hasDigitalAccess: boolean = true;
  hasPhysicalAccess: boolean = true;
  hasCryptoAccess: boolean = true;
  digitalPath = [
    '/panel/shop',
    '/panel/shop/cart',
    '/panel/shop/search',
    '/panel/shop/favorite',
  ];
  physicalPath = ['/panel/shop/activate'];
  cryptoPath = ['/panel/shop/crypto'];
  constructor(
    private permissionResolver: PermissionResolverService,
    private router: Router,
    private stateService: StateService
  ) {}

  updatePermissions() {
    this.hasDigitalAccess = true;
    this.hasPhysicalAccess = true;
    this.hasCryptoAccess = true;
    this.isSubUser = this.permissionResolver.permissionInitInfo.sub_user
      ? true
      : false;

    this.permissions = this.isSubUser
      ? this.permissionResolver.permissionInitInfo.sub_user
      : this.permissionResolver.permissionInitInfo.panel_permissions;
  }

  get accessList() {
    this.updatePermissions();
    this.checkAccessList();
    return {
      digital: this.hasDigitalAccess,
      physical: this.hasPhysicalAccess,
      crypto: this.hasCryptoAccess,
    };
  }

  setPermissionRoute(route) {
    this.updatePermissions();

    if (!this.permissions) {
      return;
    }

    this.checkAccessList();

    if (!this.hasDigitalAccess && this.digitalPath.includes(route)) {
      this.stateService.endLoading();
      if (this.hasPhysicalAccess) {
        this.router.navigate(['/panel/shop/activate']);
      } else if (this.hasCryptoAccess) {
        this.router.navigate(['/panel/shop/crypto']);
      } else {
        this.router.navigate(['/panel/shop/profile']);
      }
    }

    if (!this.hasPhysicalAccess && this.physicalPath.includes(route)) {
      this.stateService.endLoading();
      if (this.hasDigitalAccess) {
        this.router.navigate(['/panel/shop']);
      } else if (this.hasCryptoAccess) {
        this.router.navigate(['/panel/shop/crypto']);
      } else {
        this.router.navigate(['/panel/shop/profile']);
      }
    }

    if (!this.hasCryptoAccess && this.cryptoPath.includes(route)) {
      this.stateService.endLoading();
      if (this.hasDigitalAccess) {
        this.router.navigate(['/panel/shop']);
      } else if (this.hasPhysicalAccess) {
        this.router.navigate(['/panel/shop/activate']);
      } else {
        this.router.navigate(['/panel/shop/profile']);
      }
    }
  }

  checkAccessList() {
    if (!this.permissions) {
      return;
    }

    if (!this.isSubUser) {
      this.permissions.map((el) => {
        if (el.permission_type == 1 && el.action == 2) {
          this.hasDigitalAccess = false;
        } else if (el.permission_type == 2 && el.action == 2) {
          this.hasPhysicalAccess = false;
        } else if (el.permission_type == 3 && el.action == 2) {
          this.hasCryptoAccess = false;
        }
      });
    } else {
      this.hasDigitalAccess = this.permissions.can_order_digital;
      this.hasPhysicalAccess = this.permissions.can_order_physical;
      this.hasCryptoAccess = this.permissions.can_order_crypto;
    }
  }

  setBottomNavLinks(urls) {
    this.updatePermissions();

    if (!this.permissions) {
      return urls;
    }

    this.checkAccessList();

    let navItems = urls.filter((el) => {
      if (
        !(el.link == '/panel/shop' && !this.hasDigitalAccess) &&
        !(el.link == '/panel/shop/activate' && !this.hasPhysicalAccess) &&
        !(el.link == '/panel/shop/crypto' && !this.hasCryptoAccess)
      ) {
        return el;
      }
    });

    return navItems;
  }
}
