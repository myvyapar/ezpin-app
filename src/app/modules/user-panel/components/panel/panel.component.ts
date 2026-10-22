import { Component, OnInit } from '@angular/core';
import { PermissionService } from '../../shop/services/permission.service';
import { NavigationEnd, Event, Router, RouterEvent } from '@angular/router';
import { filter } from 'rxjs/operators';
import { LocalStorageService } from 'src/app/modules/shared/services/storage/local-storage.service';
import { RegistersService } from 'src/app/modules/shared/services/registers/registers.service';
import { EventType } from 'src/app/modules/shared/models/logs.model';
@Component({
  selector: 'app-panel',
  templateUrl: './panel.component.html',
  styleUrls: ['./panel.component.scss'],
})
export class PanelComponent implements OnInit {
  customPage: boolean = false;
  hiddenToolbar: boolean = false;
  isEGiftPage: boolean = true;
  isMenuPage: boolean = false;

  constructor(
    private localStorageService: LocalStorageService,
    private router: Router,
    private permissionService: PermissionService,
    private registerService: RegistersService
  ) { }

  ngOnInit(): void {
    this.registerDevice();
  }

  registerDevice() {
    const registerToken = this.localStorageService.getItem('register-token');
    if (registerToken) {
      this.registerService.createEventLog(EventType.APP_OPEN).subscribe();
    } else {
      this.registerService.registerDevice().subscribe((data) => {
        this.localStorageService.setItem('register-token', data.token);
        this.registerService.createEventLog(EventType.APP_OPEN).subscribe();
      });
    }
  }

  ngAfterViewInit(): void {
    this.checkRoute(this.router.url);
    this.router.events
      .pipe(
        filter((e: Event): e is NavigationEnd => e instanceof NavigationEnd)
      )
      .subscribe((e: RouterEvent) => {
        this.checkRoute(e.url);
      });
  }

  checkRoute(url) {
    this.permissionService.setPermissionRoute(url);
    this.isEGiftPage = true;
    this.customPage = false;
    this.hiddenToolbar = false;
    this.isMenuPage = false;

    if (['/panel/shop/menu',
    ].includes(url)) {
      this.isMenuPage = true;
    }

    if ([
      '/panel/shop/crypto',
      '/panel/shop/activate',
      '/panel/shop/profile',
      '/panel/shop/wallet',
      '/panel/shop/orders',
    ].includes(url)) {
      this.isEGiftPage = false
    }

    if (
      [
        '/panel/shop/orders#detail',
        '/panel/shop/wallet',
        '/panel/shop/profile',
        '/panel/shop/cart',
      ].includes(url)
    ) {
      this.hiddenToolbar = true;
    }

    if (
      [
        '/panel/shop/wallet',
        '/panel/shop/search',
        '/panel/shop/profile',
        '/panel/shop/cart',
      ].includes(url)
    ) {
      this.customPage = true;
    }
  }
}
