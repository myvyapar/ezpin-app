import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { EventType } from 'src/app/modules/shared/models/logs.model';
import { RegistersService } from 'src/app/modules/shared/services/registers/registers.service';
import { PermissionResolverService } from 'src/app/modules/shared/services/resolver/permission-resolver.service';
import { SnackBarService } from 'src/app/modules/shared/services/snack-bar.service';
import { Category } from '../../models/category.model';
import { Product } from '../../models/products.model';
import { ShopService } from '../../services/shop.service';
import { MessageDialogComponent } from '../message-dialog/message-dialog.component';
import { PinCodeComponent } from '../pin-code/pin-code.component';

@Component({
  selector: 'bulk-activate',
  templateUrl: './bulk-activate.component.html',
  styleUrls: ['./bulk-activate.component.scss'],
})
export class BulkActivateComponent implements OnInit {
  currentStep: number = 1;
  productForm: FormGroup;
  categoryList: Category[];
  isFinish: boolean = false;
  offset: number = 0;
  limit: number = 20;
  isScroll: boolean = true;
  products: Product[] = [];
  selectedCategory: number;
  selectedProduct: Product;
  productQuantity: number = 0;
  pricePlaceholder: string;
  priceErrorText: string;
  quantityError: string;
  invalidInput: boolean = true;
  @Output() showTab = new EventEmitter<boolean>();

  constructor(
    private shopService: ShopService,
    private snackBarService: SnackBarService,
    public dialog: MatDialog,
    private permission: PermissionResolverService,
    private registerService: RegistersService
  ) {}

  // onScroll() {
  //   if (!this.isScroll && !this.isFinish && this.currentStep == 2) {
  //     this.isScroll = true;
  //     this.onCategoryClick(this.selectedCategory);
  //   }
  // }

  showMore() {
    if (!this.isFinish && this.currentStep == 2) {
      this.onCategoryClick(this.selectedCategory);
    }
  }

  ngOnInit(): void {
    this.getCategoryList();
  }

  getCategoryList() {
    this.shopService.getBulkCategories().subscribe((bulkCategories) => {
      this.categoryList = bulkCategories;
    });
  }

  onCategoryClick(id) {
    this.showTab.emit(false);
    this.currentStep = 2;
    this.selectedCategory = id;

    this.shopService
      .getProductList({ limit: this.limit, offset: this.offset, category: id })
      .subscribe((data) => {
        this.products = this.products.concat(data.results);
        if (!data.next) {
          this.isFinish = true;
        }
        this.isScroll = false;
        this.offset += 20;
      });
  }

  selectProduct(product: Product) {
    if (product.price_ranges_ratio.length < 1) {
      return;
    }
    this.showTab.emit(false);
    this.currentStep = 3;
    this.selectedProduct = product;
    this.productQuantity = 0;
    this.priceErrorText = '';
    this.quantityError = '';
    this.invalidInput = true;
    this.initForm();
    if (product.card_type == 1 && product.price_max != product.price_min) {
      this.pricePlaceholder = `Type an amount between ${product.currency_data.symbol}${product.price_min} and ${product.currency_data.symbol}${product.price_max}`;
    }
    this.checkInputChange();
  }

  initForm() {
    this.productForm = new FormGroup({
      price: new FormControl(''),
      quantity: new FormControl(''),
      fromSerial: new FormControl(''),
      toSerial: new FormControl(''),
    });

    if (this.selectedProduct.card_type == 1) {
      this.productForm
        .get('fromSerial')
        .setValidators([
          Validators.required,
          Validators.pattern('^(0|[1-9][0-9]*)$'),
        ]);
      this.productForm
        .get('toSerial')
        .setValidators([
          Validators.required,
          Validators.pattern('^(0|[1-9][0-9]*)$'),
        ]);
      if (this.selectedProduct.price_min != this.selectedProduct.price_max) {
        this.productForm
          .get('price')
          .setValidators([
            Validators.required,
            Validators.max(this.selectedProduct.price_max),
            Validators.min(this.selectedProduct.price_min),
          ]);
      }
    } else {
      this.productForm
        .get('quantity')
        .setValidators([
          Validators.required,
          Validators.pattern('^(0|[1-9][0-9]*)$'),
        ]);
    }
  }

  backStep() {
    if (this.currentStep > 1) {
      if (this.currentStep == 2) {
        this.products = [];
        this.offset = 0;
      }
      this.currentStep -= 1;
    }

    if (this.currentStep === 1) {
      this.showTab.emit(true);
    }
  }

  checkInputChange(): void {
    this.productForm.valueChanges.subscribe((value) => {
      if (this.productForm.get('price').invalid && value.price) {
        this.priceErrorText = 'No price range specified for this amount.';
      } else {
        this.priceErrorText = '';
      }

      if (Number(value.toSerial) > Number(value.fromSerial)) {
        this.productQuantity =
          this.productForm.get('toSerial').value -
          this.productForm.get('fromSerial').value +
          1;
        if (this.productQuantity < 10) {
          this.quantityError = 'At least 10 cards must be submitted.';
        } else if (this.productQuantity > 500) {
          this.quantityError = 'Quantity value must be lower than 500.';
        } else {
          this.quantityError = '';
        }
      } else {
        this.productQuantity = 0;
        this.quantityError = '';
      }

      if (
        this.productForm.invalid ||
        (this.selectedProduct.card_type == 1 &&
          (this.productQuantity > 500 || this.productQuantity < 10))
      ) {
        this.invalidInput = true;
      } else {
        this.invalidInput = false;
      }
    });
  }

  activateProduct() {
    if (this.invalidInput) {
      return;
    }

    let sendData = {
      product: this.selectedProduct.id,
      price: '',
      serial: '',
      to_serial: '',
      count: '',
    };

    if (this.selectedProduct.card_type == 1) {
      if (this.selectedProduct.price_min != this.selectedProduct.price_max) {
        sendData.price = this.productForm.get('price').value;
      } else {
        sendData.price = `${this.selectedProduct.price_min}`;
      }
      sendData.to_serial = this.productForm.get('toSerial').value;
      sendData.serial = this.productForm.get('fromSerial').value;
      sendData.count = `${this.productQuantity}`;
    } else {
      if (this.selectedProduct.price_min != this.selectedProduct.price_max) {
        sendData.price = this.productForm.get('price').value;
      } else {
        sendData.price = `${this.selectedProduct.price_min}`;
      }
      sendData.count = this.productForm.get('quantity').value;
      delete sendData.serial;
      delete sendData.to_serial;
    }

    this.checkPin(sendData);
  }

  checkPin(sendData) {
    let hasPin = this.permission.permissionInitInfo.profile.pin_required;
    if (hasPin) {
      this.openPinCode(sendData);
    } else {
      this.activatePhysical(sendData);
    }
  }

  activatePhysical(sendData) {
    this.shopService.activatePhysical(sendData).subscribe(
      (data) => {
        this.registerService
          .createEventLog(EventType.PHYSICAL_BULK_ORDER, {
            transaction_id: data.id,
            status: data.status,
          })
          .subscribe();
        this.currentStep = 2;
        this.snackBarService.showSnackBar(
          'Physical card activated successfully',
          'primary',
          2000
        );
      },
      (error) => {
        if (error.error.code === '617') {
          this.openErrorDialog(sendData);
        } else {
          this.currentStep = 2;
        }
      }
    );
  }

  openPinCode(formData) {
    const dialogRef = this.dialog.open(PinCodeComponent, {
      minWidth: '300px',
      maxWidth: '500px',
      panelClass: 'full-with-dialog',
    });

    dialogRef.afterClosed().subscribe((data) => {
      if (data?.pinCode) {
        let sendData = { ...formData, pin: data.pinCode };
        this.activatePhysical(sendData);
      }
    });
  }

  openErrorDialog(formData) {
    const dialogRef = this.dialog.open(MessageDialogComponent, {
      minWidth: '300px',
      maxWidth: '500px',
      panelClass: 'backdropBackground',
      data: {
        title: 'Incorrect Pin code',
        confirm: 'OK',
        cancel: 'Cancel',
        description:
          'Insert pin code was not correct. If you want to retry press OK button.',
      },
    });

    dialogRef.afterClosed().subscribe((data) => {
      if (data?.confirm) {
        this.openPinCode(formData);
      }
    });
  }
}
