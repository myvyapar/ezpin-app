import { Component, Input, OnInit } from '@angular/core';
import { MatBottomSheet } from '@angular/material/bottom-sheet';
import { PermissionResolverService } from 'src/app/modules/shared/services/resolver/permission-resolver.service';
import { Product } from '../../models/products.model';
import { ShopService } from '../../services/shop.service';
import { BuyProductComponent } from '../buy-product/buy-product.component';
import { DecimalPipe } from '@angular/common';

@Component({
  selector: 'product-card',
  templateUrl: './product-card.component.html',
  styleUrls: ['./product-card.component.scss'],
})
export class ProductCardComponent implements OnInit {
  @Input() category: Product;
  @Input() isFavorite: boolean;
  showBuyingPrice: boolean;
  hasRange: boolean = true;

  constructor(
    private permission: PermissionResolverService,
    private shopService: ShopService,
    private bottomSheet: MatBottomSheet,
    private _decimalPipe: DecimalPipe
  ) { }

  ngOnInit(): void {
    this.setBuyingPrice();
  }

  setBuyingPrice() {
    this.showBuyingPrice = this.permission.permissionInitInfo.profile.show_buying_price;
  }

  addFavorite(id: number, categoryIndex) {
    this.shopService.addToFavorite(id).subscribe(() => {
      this.category.suggestions[categoryIndex].is_favorite = true;
    });
  }

  deleteFavorite(id: number, categoryIndex) {
    this.shopService.deleteFromFavorite(id).subscribe(() => {
      this.category.suggestions[categoryIndex].is_favorite = false;
    });
  }

  selectProduct(product, hasRange: boolean) {
    let data;
    let showPrice;

    if (!hasRange) {
      if (this.findRatio(this.category.price_ranges_ratio, product)) {
        if (product.showing_price) {
          showPrice = product.showing_price.price;
        } else {
          showPrice = product.price;
        }
      }
    }

    if (
      !hasRange &&
      (!showPrice || product.available_cards_text === 'Out of stock')
    ) {
      return;
    }

    if (
      hasRange &&
      (this.category?.price_ranges_ratio?.length < 1 ||
        (!this.category?.pre_order &&
          this.category?.price_ranges_ratio?.length > 0))
    ) {
      return;
    }

    let sendData = {
      id: this.category.id,
      name: this.category.title,
      image: this.category.image,
      hasRange: hasRange,
      hasPreOrder: this.category.pre_order,
      currency: this.category.currency_data.symbol,
      superImmediate: this.category.super_immediate,
      description:this.category.description
    };

    if (hasRange) {
      data = {
        ...sendData,
        product: this.category,
        showBuyingPrice: this.showBuyingPrice,
      };
    } else {
      let price = this.showBuyingPrice
        ? this.calcBuyingPrice(this.category?.price_ranges_ratio, product)
        : showPrice;
      let priceStatus = this.productStatus(
        this.category?.price_ranges_ratio,
        product
      );
      data = {
        ...sendData,
        product: {...product,limit_price:this.category.limit_price,limit_quantity:this.category.limit_quantity},
        price,
        priceStatus,
        showBuyingPrice: this.showBuyingPrice,
      };
    }

    this.bottomSheet.open(BuyProductComponent, {
      data: data,
    });
  }

  calcBuyingPrice(category, product) {
    let ratio = this.findRatio(category, product);
    let productPrice;
    if (!ratio) {
      return product.price;
    }

    if (product.price_fix && product.price_fix > 0) {
      productPrice = product.price + ratio * product.price_fix;
      return this._decimalPipe.transform(productPrice, '1.0-2');
    } else if (product.price_fix && product.price_fix == 0) {
      return this._decimalPipe.transform(product.price * ratio, '1.0-2');
    } else if (this.category?.price_fix && this.category?.price_fix > 0) {
      productPrice = product.price + ratio * this.category.price_fix;
      return this._decimalPipe.transform(productPrice, '1.0-2');
    }

    return this._decimalPipe.transform(product.price * ratio, '1.0-2');
  }

  activationFee(category, product) {
    let ratio = this.findRatio(category.price_ranges_ratio, product);
    let activationFee;
    if (!ratio) {
      return;
    }

    if (product.price_fix && product.price_fix > 0) {
      activationFee = this._decimalPipe.transform(
        ratio * product.price_fix,
        '1.0-2'
      );
      return `${category.currency_data.symbol}${activationFee} activation fee is included`;
    } else if (category.price_fix && category.price_fix > 0) {
      activationFee = this._decimalPipe.transform(
        ratio * category.price_fix,
        '1.0-2'
      );
      return `${category.currency_data.symbol}${activationFee} activation fee is included`;
    }
  }

  productStatus(category, product) {
    let findRatio = this.findRatio(category, product);

    if (!findRatio) {
      return null;
    }

    if (product.available_cards_text === 'Available' || product.available_cards > 0 || this.category.super_immediate) {
      return null;
    } else {
      return product.available_cards_text;
    }
  }

  activationFeeWithRange(product: Product) {
    if (!product.price_fix || product.price_fix == 0) {
      return
    }

    let productRatio = product.price_ranges_ratio.find((ratio) => {
      if (ratio.price_min == product.price_min && ratio.price_max == product.price_max) {
        return ratio;
      }
    });

    if (productRatio) {
      let activationFee = this._decimalPipe.transform(productRatio.ratio * product.price_fix, '1.0-2');
      return `${product.currency_data.symbol}${activationFee} activation fee is included`
    }
  }

  findRatio(ratio, product) {
    let findRatio = ratio.find((el) => {
      if (el.price_min === product.price && el.price_max === product.price) {
        return el;
      }

      if (el.price_min <= product.price && el.price_max >= product.price) {
        return el;
      }
    });

    return findRatio?.ratio;

  }

  calcDiscountOver(product) {
    let ratio;
    let overDiscountPercent;

    if (product.price_ranges_ratio.length < 1) {
      return
    }

    let productRatio = product.price_ranges_ratio.find((ratio) => {
      if (ratio.price_min == product.price_min && ratio.price_max == product.price_max) {
        return ratio;
      }
    });

    if (productRatio?.ratio) {
      ratio = Number(productRatio.ratio);
      overDiscountPercent = this._decimalPipe.transform(Math.abs(1 - ratio) * 100, '1.0');
      return { ratio, overDiscountPercent }
    }

  }
}
