import { Component, Input, OnInit } from '@angular/core';
import { CartService } from '../../shop/services/cart.service';
import { Router } from '@angular/router';
import { PermissionService } from '../../shop/services/permission.service';
import { ShopService } from '../../shop/services/shop.service';
import { Regions } from '../../shop/models/regions.model';
import { MatDialog } from '@angular/material/dialog';
import { RegionsComponent } from '../regions/regions.component';
import { Subscription } from 'rxjs';
import { StateService } from 'src/app/modules/shared/services/storage/state.service';

@Component({
  selector: 'app-toolbar',
  templateUrl: './toolbar.component.html',
  styleUrls: ['./toolbar.component.scss'],
})
export class ToolbarComponent implements OnInit {
  @Input() isEGiftPage: boolean;
  @Input() isMenuPage: boolean;
  cartCount: number = 0;
  regionFlag: string = '/assets/images/icons/world-flag.png';
  isShowFavorite: boolean = true;
  regions: Regions;
  regionSubscription: Subscription;
  constructor(
    private cartService: CartService,
    private router: Router,
    private permissionService: PermissionService,
    private shopService: ShopService,
    public dialog: MatDialog,
    private stateService: StateService
  ) { }

  ngOnInit(): void {
    this.setCartCount();
    this.setFavoriteStatus();
    this.getRegionList();
    this.checkRegion();
  }

  ngOnDestroy() {
    this.regionSubscription.unsubscribe();
  }

  getRegionList() {
    this.shopService.getRegions().subscribe(res => {
      this.regions = res;
    })
  }

  checkRegion() {
    this.regionSubscription = this.stateService.getLastRegion().subscribe(res => {
      if (res?.id > 0) {
        console.log(res)
        this.regionFlag = res.image
      } else if (res?.id == 0) {
        this.regionFlag = '/assets/images/icons/world-flag.png';
      }
    })
  }

  setFavoriteStatus() {
    this.isShowFavorite = this.permissionService.accessList.digital;
  }

  setCartCount() {
    this.cartService.getCart.subscribe((data) => {
      this.cartCount = 0;
      if (data) {
        data.products.map((el) => {
          this.cartCount += el.count;
        });
      }
    });
  }

  linkToBasket() {
    if (this.cartCount > 0) {
      this.router.navigate(['/panel/shop/cart']);
    }
  }

  openRegions() {
    const dialogRef = this.dialog.open(RegionsComponent, {
      minWidth: '350px',
      maxWidth: '500px',
      panelClass: 'description-dialog',
      data: { regions: this.regions?.results },
    });
  }

}
