import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { SnackBarService } from 'src/app/modules/shared/services/snack-bar.service';
import { CartService } from '../../services/cart.service';
import { ShopService } from '../../services/shop.service';
import { CreateOrder } from '../../models/order.model';
import { MatDialog } from '@angular/material/dialog';
import { PinCodeComponent } from '../pin-code/pin-code.component';
import { PermissionResolverService } from 'src/app/modules/shared/services/resolver/permission-resolver.service';
import { ExchangeProcessComponent } from '../exchange-process/exchange-process.component';
import { SharedService } from 'src/app/modules/shared/services/shared.service';
import { MessageDialogComponent } from '../message-dialog/message-dialog.component';
import { RegistersService } from 'src/app/modules/shared/services/registers/registers.service';
import { EventType } from 'src/app/modules/shared/models/logs.model';
import { StateService } from 'src/app/modules/shared/services/storage/state.service';
import { Invoice } from '../../models/invoice.model';
import { Subscription } from 'rxjs';
import { v4 as uuidv4 } from 'uuid';

@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.scss'],
})
export class CartComponent implements OnInit, OnDestroy {
  productList;
  receiveForm = new FormControl('');
  totalPrice: number = 0;
  isSelectedReceive: boolean = false;
  receiveType: string;
  temporaryInput: string;
  isSecondStep: boolean = false;
  isUPC: boolean = false;
  isPreOrderBasket: boolean;
  invoices: Invoice;
  isActiveButton = {
    email: true,
    print: true,
    sms: true,
    whatsapp: true
  };
  totalProductNumber: number = 0;
  cartSubscription: Subscription;
  basketUUID = uuidv4();

  constructor(
    private cartService: CartService,
    private router: Router,
    public dialog: MatDialog,
    private snackBarService: SnackBarService,
    private shopService: ShopService,
    private permissionResolverService: PermissionResolverService,
    private sharedService: SharedService,
    private registerService: RegistersService,
    private stateService: StateService
  ) { }

  ngOnInit(): void {
    this.setProductList();
  }

  ngOnDestroy() {
    this.cartSubscription.unsubscribe();
  }

  setProductList() {
    this.cartSubscription = this.cartService.getCart.subscribe((data) => {
      if (!data) {
        this.router.navigate(['/panel/shop']);
      } else {
        this.productList = data;
        this.calcTotalPrice();
        this.checkValidateReceiveType();
      }
    });
  }

  checkValidateReceiveType() {
    this.totalProductNumber = 0;
    this.productList.products.map((el) => {
      this.totalProductNumber += el.count;
    });

    if ((this.productList.products.length > 1)) {
      this.isActiveButton.sms = false;
      this.isActiveButton.email = false;
      this.isActiveButton.print = false;
      this.isActiveButton.whatsapp = false;
    } else {
      this.isActiveButton.sms = true;
      this.isActiveButton.email = true;
      this.isActiveButton.print = true;
      this.isActiveButton.whatsapp = true;
    }

    if (this.totalProductNumber > 5) {
      this.isActiveButton.print = false;
    } else {
      this.isActiveButton.print = true;
    }

    this.checkProductType();
  }

  checkProductType() {
    if (!this.getPreOrderStatus() || (this.productList?.supperImmediate && this.productList.products[0].count <= this.productList.products[0].availableCard)) {
      this.productList.type = 'available'
    } else {
      this.productList.type = 'preOrder'
    }
  }

  plus(index) {
    this.productList.products[index].count += 1;
    this.cartService.setCart(this.productList);
  }

  minus(index) {
    if (this.productList.products[index].count > 1) {
      this.productList.products[index].count -= 1;
    }
    this.cartService.setCart(this.productList);
  }

  deleteProduct(index) {
    this.productList.products.splice(index, 1);
    if (this.productList.products.length < 1) {
      this.cartService.clearCart();
    } else {
      this.cartService.setCart(this.productList);
    }
  }

  calcTotalPrice() {
    this.totalPrice = 0;
    this.productList?.products.map((el) => {
      this.totalPrice += el.showPrice * el.count;
    });
  }

  selectReceive(type: string) {
    if (type == 'print') {
      this.confirmPrint();
    } else {
      this.receiveType = type;
      this.isSelectedReceive = true;
      if (type === 'email') {
        this.receiveForm.setValidators([Validators.required, Validators.email]);
      } else {
        this.receiveForm.setValidators([
          Validators.required,
          Validators.pattern(
            '(([+][(]?[0-9]{1,3}[)]?)|([(]?[0-9]{4}[)]?))s*[)]?[-s.]?[(]?[0-9]{1,3}[)]?([-s.]?[0-9]{3})([-s.]?[0-9]{3,4})'
          ),
        ]);
        this.receiveForm.patchValue(
          this.permissionResolverService.permissionInitInfo.profile.city.state
            .country.phone_prefix
        );
      }
    }
  }

  confirmPrint() {
    if (this.productList.type != 'available') {
      return;
    }

    this.finalConfirm(true);
  }

  cancelReceive() {
    this.receiveType = '';
    this.receiveForm.patchValue('');
    this.isSelectedReceive = false;
    this.isSecondStep = false;
  }

  submit() {
    if (!this.isSecondStep) {
      this.firstStepConfirm();
    } else {
      this.finalConfirm(false);
    }
  }

  firstStepConfirm() {
    if (this.receiveForm.invalid) {
      this.snackBarService.showSnackBar(
        'Your phone/Email is not valid',
        'primary',
        3000
      );
      return;
    }

    this.temporaryInput = this.receiveForm.value;

    if (this.receiveType === 'email') {
      this.receiveForm.patchValue('');
    } else {
      this.receiveForm.patchValue(
        this.permissionResolverService.permissionInitInfo.profile.city.state
          .country.phone_prefix
      );
    }

    this.isSecondStep = true;
    return;
  }

  finalConfirm(isPrint: boolean) {
    if (!isPrint && this.receiveForm.value != this.temporaryInput) {
      this.snackBarService.showSnackBar(
        "Your phone/email doesn't match ",
        'primary',
        3000
      );
      return;
    }

    if (!this.isActiveButton.sms || !this.isActiveButton.email || !this.isActiveButton.whatsapp) {
      this.snackBarService.showSnackBar(
        'Maximum number of cards is 5!',
        'primary',
        3000
      );
      return;
    }


    let items = [];

    this.productList.products.map((el) => {
      items.push({
        product_id: el.id,
        item_count: el.count,
        pre_order: this.getPreOrderStatus(),
        product_price: el.price,
      });
    });

    let sendData: CreateOrder;
    if (isPrint) {
      sendData = {
        items: items,
        type: 2,
        reference_code: this.basketUUID,
      };
    } else {
      sendData = {
        items: items,
        type: 5,
        reference_code: this.basketUUID,
        [this.receiveType]: this.receiveForm.value,
      };
    }

    this.checkPinStatus(sendData);
  }

  getPreOrderStatus() {
    if (this.productList?.supperImmediate && (this.productList.products[0].count > 5) && (this.productList.products[0].count > this.productList.products[0].availableCard)) {
      return true
    } else if ((this.productList.type == 'available' || this.productList?.supperImmediate) && ((this.productList.products[0].count < 6 && this.productList?.supperImmediate) || (this.productList.products[0].count <= this.productList.products[0].availableCard))) {
      return false
    } else {
      return true;
    }
  }

  checkPinStatus(sendData) {
    let hasPin = this.permissionResolverService.permissionInitInfo.profile
      .pin_required;
    if (!hasPin) {
      this.checkBalance(sendData);
    } else {
      this.openPinCode(sendData);
    }
  }

  checkBalance(sendData) {
    this.sharedService.getUserPermissions().subscribe((data) => {
      this.checkWallet(sendData, data.profile.balances);
    });
  }

  checkWallet(sendData, balances) {
    let orderCurrency = this.productList.currency;
    let userBalance = balances.find((el) => {
      return el.currency.symbol === orderCurrency;
    });

    let total = 0;
    this.productList.products.forEach((element) => {
      total += Number(element.count) * Number(element.price);
    });

    if (
      !userBalance ||
      (userBalance?.balance < total && orderCurrency != '$')
    ) {
      this.exchangeProcess(sendData);
    } else {
      this.createOrderApi(sendData);
    }
  }

  exchangeProcess(sendData) {
    let total = 0;
    this.productList.products.forEach((element) => {
      total += Number(element.count) * Number(element.price);
    });

    const dialogRef = this.dialog.open(ExchangeProcessComponent, {
      minWidth: '300px',
      maxWidth: '500px',
      panelClass: 'full-with-dialog',
      data: { currency: this.productList.currency, total },
    });

    dialogRef.afterClosed().subscribe((data) => {
      if (data?.isFinishExchange) {
        let orderData = { ...sendData, can_exchange: true };
        this.createOrderApi(orderData);
      }
    });
  }

  createOrderApi(sendData) {
    this.shopService.createOrder(sendData).subscribe(
      (data) => {
        this.registerService
          .createEventLog(EventType.DIGITAL_ORDER, {
            order_id: data.order_id,
          })
          .subscribe();
        if (sendData.type == 2) {
          this.stateService.startLoading();
          this.printInvoices(data.order_id);
        } else {
          this.snackBarService.showSnackBar(data.detail, 'primary', 3000);
          this.cartService.clearCart();
          this.router.navigate(['/panel/shop']);
        }
      },
      (error) => {
        if (error.error.code === '617') {
          this.openErrorDialog(sendData);
        }
      }
    );

    this.permissionResolverService.updateInfo();
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
        this.checkBalance(sendData);
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

  editForm() {
    this.receiveForm.patchValue(this.temporaryInput);
    this.isSecondStep = false;
  }

  printInvoices(orderId) {
    setTimeout(() => {
      this.stateService.endLoading();
      this.shopService.getInvoices(orderId).subscribe((data) => {
        this.invoices = data;
        this.showPrintTab();
      });
    }, 500);
  }

  showPrintTab() {
    window.addEventListener('afterprint', (event) => {
      this.changePage();
    });
    setTimeout(() => {
      let printElement = document.getElementById('invoiceList');
      if (typeof printElement !== 'undefined' && printElement !== null) {
        window.print();
      } else {
        this.cartService.clearCart();
        this.router.navigate(['/panel/shop']);
      }
    }, 500);
  }

  changePage() {
    setTimeout(() => {
      this.cartService.clearCart();
      this.router.navigate(['/panel/shop']);
    }, 1500);
  }

  linkToUPC() {
    this.isUPC = true;
  }

  backToCart() {
    this.isUPC = false;
  }
}
