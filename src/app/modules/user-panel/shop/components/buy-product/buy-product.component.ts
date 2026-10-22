import { Component, Inject, OnInit } from '@angular/core';
import {
  MatBottomSheetRef,
  MAT_BOTTOM_SHEET_DATA,
} from '@angular/material/bottom-sheet';
import { FormControl, Validators } from '@angular/forms';
import { CartService } from './../../services/cart.service';
import { Cart } from '../../models/cart.model';
import { SnackBarService } from 'src/app/modules/shared/services/snack-bar.service';
import { DecimalPipe } from '@angular/common';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { ProductDescriptionComponent } from '../product-description/product-description.component';

@Component({
  selector: 'app-buy-product',
  templateUrl: './buy-product.component.html',
  styleUrls: ['./buy-product.component.scss'],
})
export class BuyProductComponent implements OnInit {
  count: number = 1;
  priceRange = new FormControl('');
  activationFeeText: string;
  showPrice: number;
  rangePlaceholder: string;
  carts: Cart;
  inputMessage: string;
  isAddedProduct: boolean = false;
  isShowStatus: boolean = false;
  productDescriptions = [];

  constructor(
    private cartService: CartService,
    private snackBarService: SnackBarService,
    private bottomSheetRef: MatBottomSheetRef<BuyProductComponent>,
    @Inject(MAT_BOTTOM_SHEET_DATA) public data: any,
    private _decimalPipe: DecimalPipe,
    private router: Router,
    public dialog: MatDialog,
  ) { }

  ngOnInit(): void {
    this.setPlaceholder();
    this.setPriceRange();
    this.getCarts();
    this.checkInputChange();
    this.setShowStatus();
    this.setProductDescriptions();
  }

  checkInputChange(): void {
    this.priceRange.valueChanges.subscribe((value) => {
      this.onInputChanges();
    });
  }

  onInputChanges() {
    if (!this.priceRange.value) {
      this.inputMessage = '';
      this.data.priceStatus = '';
    } else if (this.priceRange.invalid) {
      this.data.priceStatus = '';
      this.inputMessage = 'No price range specified for this amount';
    } else {
      this.data.priceStatus = this.productStatus();
      this.setShowStatus();
      this.showPrice = this.data.showBuyingPrice
        ? this.calcBuyingPrice(this.data.product, this.priceRange.value)
        : this.priceRange.value;
      this.inputMessage = `Our paying for this amount of product will be equal to ${this.data.currency
        }${this._decimalPipe.transform(this.count * this.showPrice, '1.0-2')}`;
    }
  }

  calcBuyingPrice(product, priceInput) {
    priceInput = Number(priceInput);
    let suggestionPrice;

    let ratio = product.price_ranges_ratio.find((el) => {
      if (el.price_min === priceInput && el.price_max === priceInput) {
        return el;
      }

      if (el.price_min <= priceInput && el.price_max >= priceInput) {
        return el;
      }
    });

    let suggestion = product.suggestions.find((el) => {
      if (el.price == this.priceRange.value) {
        return el;
      }
    });

    if (ratio?.ratio) {
      let defaultPrice = this._decimalPipe.transform(
        priceInput * ratio?.ratio,
        '1.0-2'
      );
      if (suggestion && suggestion.price_fix && suggestion.price_fix > 0) {
        suggestionPrice = this._decimalPipe.transform(
          priceInput + ratio?.ratio * suggestion.price_fix,
          '1.0-2'
        );
        this.activationFeeText = `An activation fee of ${this.data.product.currency_data.symbol}${suggestionPrice} per card will apply`;
        return suggestionPrice;
      } else if (
        suggestion &&
        suggestion.price_fix &&
        suggestion.price_fix == 0
      ) {
        return defaultPrice;
      } else if (product.price_fix && product.price_fix > 0) {
        suggestionPrice = this._decimalPipe.transform(
          priceInput + ratio?.ratio * product.price_fix,
          '1.0-2'
        );
        this.activationFeeText = `An activation fee of ${this.data.product.currency_data.symbol}${suggestionPrice} per card will apply`;
        return suggestionPrice;
      } else {
        return defaultPrice;
      }
    }
  }

  setProductDescriptions() {
    try {
      let descriptionList = JSON.parse(this.data?.description)
      for (let description of descriptionList.content) {
        this.productDescriptions.push(description)
      }
    } catch (error) {
      if (this.data?.description) {
        let description = {
          title: 'Description',
          type: 'description',
          description: this.data?.description
        }
        this.productDescriptions.push(description);
      }
    }
  }

  openDescriptionDialog() {
    this.dialog.open(ProductDescriptionComponent, {
      minWidth: '300px',
      maxWidth: '500px',
      panelClass: 'description-dialog',
      data: { descriptions: this.productDescriptions }
    });
  }

  getCarts() {
    this.cartService.getCart.subscribe((data) => {
      this.carts = data;
    });
  }

  setPlaceholder() {
    if (this.data.hasRange) {
      this.rangePlaceholder = `${this.data.product.currency_data.symbol}${this.data.product.price_min} -  ${this.data.product.currency_data.symbol}${this.data.product.price_max}`;
    }
  }

  setPriceRange() {
    if (this.data.hasRange) {
      this.priceRange.setValidators([
        Validators.min(this.data.product.price_min),
        Validators.max(this.data.product.price_max),
        Validators.required,
      ]);
    }
  }

  plus() {
    this.count += 1;

    if (this.data.hasRange) {
      this.onInputChanges();
    } else {
      this.setShowStatus();
    }
  }

  minus() {
    if (this.count > 1) {
      this.count -= 1;

      if (this.data.hasRange) {
        this.onInputChanges();
      } else {
        this.setShowStatus();
      }
    }
  }

  setShowStatus() {
    let product;
    let findProduct = false;
    if (this.data.hasRange) {
      product = this.data.product.suggestions.find((el) => {
        if (el.price == this.priceRange.value) {
          findProduct = true;
          return el;
        }
      });
    } else {
      product = { available_cards: this.data?.product?.available_cards };
      findProduct = true;
    }

    if (!findProduct) return;

    if ((this.data.superImmediate && this.count > 5 && this.count > product.available_cards) || !this.data.superImmediate) {
      this.isShowStatus = true;
    } else {
      this.isShowStatus = false;
    }

    if (this.count <= product.available_cards) this.isShowStatus = false
  }

  addToBasket() {
    if (this.data.hasRange && this.priceRange.invalid) {
      return;
    }

    let type;
    if (this.data.superImmediate && (this.count < 6 || this.count < this.data.product.available_cards)) {
      type = 'available';
    } else if ((this.count > this.data.product.available_cards && this.data.hasPreOrder)
      || this.data.priceStatus) {
      type = 'preOrder';
    } else if (this.count > this.data.product.available_cards && !this.data.hasPreOrder) {
      return;
    } else {
      type = 'available';
    }

    this.checkCart(type);
  }

  productStatus() {
    let findPrice = false;
    let statusText = this.data.product.suggestions.find((el) => {
      if (el.price == this.priceRange.value) {
        findPrice = true;
        return el;
      }
    });

    if (findPrice && statusText.available_cards < this.count && this.data.superImmediate) {
      return statusText.available_cards_text
    }
    else if (findPrice && statusText.available_cards > 0) {
      return '';
    } else if (findPrice && statusText.available_cards < 1) {
      return statusText.available_cards_text;
    } else {
      return this.data.product.available_cards_text;
    }
  }

 

  checkCart(type: string) {
    let cart;
    if (this.data.hasRange) {
      if (this.priceRange.valid) {
        cart = {
          name: this.productHasRangeName(),
          image: this.data.image,
          id: this.data.id,
          preOrder: this.data.hasPreOrder,
          count: this.count,
          showPrice: this.showPrice,
          price: this.priceRange.value,
          currency: this.data.currency,
          upc: this.productHasRangeUPC(),
          status: this.productStatus(),
          availableCard: this.hasRangeAvailableCards(),
        };

        this.storeCart(cart, type);
      } else {
        return;
      }
    } else {
      let currency = this.data.product.showing_price
        ? this.data.product.showing_price.showing_currency.symbol
        : this.data.currency;
      cart = {
        name: `${this.data.name} ${this.data.product.title}`,
        image: this.data.image,
        id: this.data.id,
        preOrder: this.data.hasPreOrder,
        count: this.count,
        showPrice: this.data.price,
        price: this.data.product.price,
        currency: currency,
        status: this.data.product.available_cards_text,
        upc: this.data.product.upc,
        availableCard: this.data.product.available_cards
      };

      this.storeCart(cart, type);
    }
  }

  productHasRangeUPC() {
    let findSuggestion = this.data.product.suggestions.find((el) => {
      if (el.price == this.priceRange.value) {
        return el;
      }
    });

    if (findSuggestion) {
      return findSuggestion.upc;
    } else {
      return this.data.product.upc;
    }
  }

  productHasRangeName() {
    let findSuggestion = this.data.product.suggestions.find((el) => {
      if (el.price == this.priceRange.value) {
        return el;
      }
    });

    if (findSuggestion) {
      return `${this.data.name} ${findSuggestion.title}`;
    } else {
      return this.data.name;
    }
  }

  storeCart(cart, type) {
    let added = false;
    let newCart;
    if (!this.carts) {
      newCart = {
        products: [cart],
        currency: this.data.currency,
        showCurrency: cart.currency,
        type: type,
        supperImmediate: this.data.superImmediate
      };
      this.cartService.setCart(newCart);
    } else {
      for (let index in this.carts.products) {
        if (
          this.carts.products[index].id == cart.id &&
          this.carts.products[index].price == cart.price
        ) {
          this.carts.products[index].count += cart.count;
          added = true;
        }
      }

      if (!added) {
        newCart = {
          products: [cart],
          currency: this.data.currency,
          showCurrency: cart.currency,
          type: type,
          supperImmediate: this.data.superImmediate
        };
        this.carts = newCart;
      }

      this.cartService.setCart(this.carts);
    }
    this.isAddedProduct = true;
  }

  hasRangeAvailableCards() {
    let findSuggestion = this.data.product.suggestions.find((el) => {
      if (el.price == this.priceRange.value) {
        return el;
      }
    });

    if (findSuggestion) {
      return findSuggestion.available_cards
    } else return 5
  }

  continueButton() {
    this.bottomSheetRef.dismiss();
  }

  checkoutButton() {
    if (!this.checkValidPrice() ||this.data.hasRange && this.priceRange.invalid) {
      return;
    }
    this.addToBasket();
    this.router.navigate(['/panel/shop/cart']);
    this.bottomSheetRef.dismiss();
  }

  checkValidPrice(){
    const price = this.priceRange.value ? this.priceRange.value : this.data.product.price;
    const limitQuantity = this.data.product.limit_quantity;
    const limitPrice = this.data.product.limit_price;

    if(this.count > limitQuantity && limitQuantity > 0){
      this.snackBarService.showSnackBar(`The maximum allowed quantity for this order is ${limitQuantity}`,'warn',3000);
      return false
    }else if((this.count * price) > limitPrice && limitPrice > 0){
      this.snackBarService.showSnackBar(`The maximum allowed price for this order is ${this.data.currency}${limitPrice}`,'warn',3000);
      return false
    }

    return true
  }
  
}
