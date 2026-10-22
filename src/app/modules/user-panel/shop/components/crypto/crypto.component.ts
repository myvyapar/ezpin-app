import { Component, OnInit } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { EventType } from 'src/app/modules/shared/models/logs.model';
import { RegistersService } from 'src/app/modules/shared/services/registers/registers.service';
import { PermissionResolverService } from 'src/app/modules/shared/services/resolver/permission-resolver.service';
import { SnackBarService } from 'src/app/modules/shared/services/snack-bar.service';
import { Order } from '../../models/crypto-order.model';
import { Crypto } from '../../models/crypto.model';
import { ShopService } from '../../services/shop.service';
import { MessageDialogComponent } from '../message-dialog/message-dialog.component';
import { PinCodeComponent } from '../pin-code/pin-code.component';

@Component({
  selector: 'app-crypto',
  templateUrl: './crypto.component.html',
  styleUrls: ['./crypto.component.scss'],
})
export class CryptoComponent implements OnInit {
  cryptoCurrency: Crypto;
  currentStep: number = 1;
  selectedOrder: Order;
  cryptoOrderList = [];
  cryptoCommission;
  cryptoAmount = new FormControl('');
  isFinish: boolean = false;
  offset: number = 0;
  limit: number = 20;
  isScroll: boolean = true;
  isActiveCrypto: boolean = false;

  constructor(
    private shopService: ShopService,
    public dialog: MatDialog,
    private snackBarService: SnackBarService,
    private permissionResolverService: PermissionResolverService,
    private registerService: RegistersService
  ) {}

  ngOnInit(): void {
    this.getCryptoCurrency();
    this.getCryptoCommission();
  }

  onScroll() {
    if (!this.isScroll && !this.isFinish && this.cryptoCurrency) {
      this.isScroll = true;
      this.getCryptoOrderList();
    }
  }

  showMore() {
    if (!this.isFinish && this.cryptoCurrency) {
      this.getCryptoOrderList();
    }
  }

  getCryptoCurrency() {
    this.shopService.getCryptoCurrency().subscribe((data) => {
      this.cryptoCurrency = data.results.find((el) => {
        return el.title == 'bitcoin' || el.title == 'Bitcoin';
      });

      this.cryptoAmount.setValidators([
        Validators.required,
        Validators.min(this.cryptoCurrency.allowed_currencies[0].min_amount),
        Validators.max(this.cryptoCurrency.allowed_currencies[0].max_amount),
      ]);
      this.getCryptoOrderList();
    });
  }

  getCryptoOrderList() {
    this.shopService
      .getCryptoOrderList({
        limit: this.limit,
        offset: this.offset,
        currency: this.cryptoCurrency?.id,
      })
      .subscribe((data) => {
        let orderList = data.results.filter((el) => {
          return el.status == 0;
        });
        this.cryptoOrderList = this.cryptoOrderList.concat(orderList);
        if (!data.next || orderList.length < 21) {
          this.isFinish = true;
        }
        this.isScroll = false;
        this.offset += 20;
      });
  }

  getCryptoCommission() {
    this.shopService.getCryptoCommission().subscribe((data) => {
      this.cryptoCommission = data;
      this.isActiveCrypto = true;
    });
  }

  createOrder() {
    if (!this.cryptoAmount.value) {
      this.snackBarService.showSnackBar(
        'Please type an amount',
        'primary',
        2000
      );
      return;
    } else if (this.cryptoAmount.errors?.min) {
      this.snackBarService.showSnackBar(
        'Your value must be greater than min value',
        'primary',
        2000
      );
      return;
    } else if (this.cryptoAmount.errors?.max) {
      this.snackBarService.showSnackBar(
        'Your value must be lower than max value',
        'primary',
        2000
      );
      return;
    } else if (this.cryptoAmount.invalid) {
      return;
    }

    let sendData = {
      requested_price: this.cryptoAmount.value,
      crypto_currency: this.cryptoCurrency.id,
      currency: this.cryptoCurrency.allowed_currencies[0].currency.id,
      type: 1,
    };

    this.checkPinStatus(sendData);
  }

  createCryptoOrder(sendData) {
    this.shopService.createCryptoOrder(sendData).subscribe(
      (data) => {
        if (data.status == 0) {
          this.selectedOrder = data;
          this.registerService
            .createEventLog(EventType.CRYPTO_CHECK, {
              order: data.id,
            })
            .subscribe();
          this.currentStep = 2;
        }
      },
      (error) => {
        if (error.error.code === '617') {
          this.openErrorDialog(sendData);
        }
      }
    );
  }

  checkPinStatus(sendData) {
    let hasPin =
      this.permissionResolverService.permissionInitInfo.profile.pin_required;
    if (!hasPin) {
      this.createCryptoOrder(sendData);
    } else {
      this.openPinCode(sendData);
    }
  }

  finalizeOrder(order) {
    this.selectedOrder = order;
    this.currentStep = 2;
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
        this.createCryptoOrder(sendData);
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

  onReduceStep($event) {
    if ($event && this.currentStep > 1) {
      this.currentStep = 1;
      this.offset = 0;
      this.isFinish = false;
      this.cryptoAmount.patchValue('');
      this.cryptoOrderList = [];
      this.isScroll = true;
      this.getCryptoOrderList();
    }
  }
}
