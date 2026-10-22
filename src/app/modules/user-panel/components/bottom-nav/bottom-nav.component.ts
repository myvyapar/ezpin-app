
import { Component, Input, OnDestroy, OnInit} from '@angular/core';
import {Event, NavigationEnd, Router} from '@angular/router';
import { Subject } from 'rxjs';
import { filter, takeUntil } from 'rxjs/operators';
import { PermissionService } from '../../shop/services/permission.service';

@Component({
  selector: 'bottom-nav',
  templateUrl: './bottom-nav.component.html',
  styleUrls: ['./bottom-nav.component.scss'],
})
export class BottomNavComponent implements OnInit, OnDestroy {
  @Input() rule: number;

  public isStore: boolean;
  public isDealer: boolean;
  public isProfile = false;
  public activeItem: string | null = null;

  private destroy$ = new Subject<void>();

  navItems: any[] = [
    {
      name: 'eGift',
      imageUrl: '/assets/images/icons/egift_icon.png',
      link: '/panel/shop',
    },
    {
      name: 'Card',
      imageUrl: '/assets/images/icons/barcodeLarge.png',
      link: '/panel/shop/activate',
    },
    {
      name: 'Orders',
      imageUrl: '/assets/images/icons/orders_icon.png',
      link: '/panel/shop/orders',
    },
    {
      name: 'Wishlist',
      imageUrl: '/assets/images/icons/Wishlist.png',
    },
    {
      name: 'Shop',
      imageUrl: '/assets/images/icons/Shop.png',
    },
  ];

  private readonly hiddenRoutes = [
    '/panel/shop/cart',
    '/panel/shop/search',
    '/panel/shop/orders#detail',
    '/panel/shop/wallet',
    '/panel/shop/profile',
  ];

  constructor(
    private router: Router,
    private permissionService: PermissionService
  ) {}

  ngOnInit(): void {
    this.navItems =
      this.permissionService.setBottomNavLinks(this.navItems);

    this.activeLink(this.router.url);

    this.router.events
      .pipe(
        filter(
          (event: Event): event is NavigationEnd =>
            event instanceof NavigationEnd
        ),
        takeUntil(this.destroy$)
      )
      .subscribe((event: NavigationEnd) => {
        this.activeLink(event.urlAfterRedirects);
      });
  }

  activeLink(url: string): void {
    const cleanUrl = url.split('?')[0];

    this.isProfile = this.hiddenRoutes.includes(cleanUrl);

    const matchedItem = this.navItems.find(
      (item) => item.link && item.link === cleanUrl
    );

    this.activeItem = matchedItem?.name ?? null;
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
