import { Component, Inject, OnInit } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import {
  MatBottomSheetRef,
  MAT_BOTTOM_SHEET_DATA,
} from '@angular/material/bottom-sheet';
import { MatDialog } from '@angular/material/dialog';
import { EventType } from 'src/app/modules/shared/models/logs.model';
import { RegistersService } from 'src/app/modules/shared/services/registers/registers.service';
import { PermissionResolverService } from 'src/app/modules/shared/services/resolver/permission-resolver.service';
import { SnackBarService } from 'src/app/modules/shared/services/snack-bar.service';
import { CheckCard } from '../../models/check-card.model';
import { ShopService } from '../../services/shop.service';
import { MessageDialogComponent } from '../message-dialog/message-dialog.component';
import { PinCodeComponent } from '../pin-code/pin-code.component';

@Component({
  selector: 'app-single-activate-bottom-sheet',
  templateUrl: './single-activate-bottom-sheet.component.html',
  styleUrls: ['./single-activate-bottom-sheet.component.scss'],
})
export class SingleActivateBottomSheetComponent implements OnInit {
  hasRange: boolean = false;
  priceRange = new FormControl('');
  inputMessage: string;
  invalidInput: boolean = true;
  hasBuyingPrice: boolean = true;

  constructor(
    private shopService: ShopService,
    private snackBarService: SnackBarService,
    public dialog: MatDialog,
    private permission: PermissionResolverService,
    private bottomSheetRef: MatBottomSheetRef<SingleActivateBottomSheetComponent>,
    @Inject(MAT_BOTTOM_SHEET_DATA) public data: CheckCard,
    private registerService: RegistersService
  ) {}

  ngOnInit(): void {
    if (this.data.product.price_ranges_ratio.length > 0) {
      this.checkCardRange();
      this.checkInputChange();
    } else {
      this.hasBuyingPrice = false;
    }
  }

  checkCardRange() {
    if (this.data.product.price_min != this.data.product.price_max) {
      this.hasRange = true;
      this.priceRange.setValidators([
        Validators.min(this.data.product.price_min),
        Validators.max(this.data.product.price_max),
      ]);
    }
  }

  checkInputChange(): void {
    let currency = this.data.product.currency_data.symbol;
    this.inputMessage = `Your amount should exist between ${currency}${this.data.product.price_min} and ${currency}${this.data.product.price_max}`;

    this.priceRange.valueChanges.subscribe((value) => {
      if (!this.priceRange.value) {
        this.invalidInput = true;
        this.inputMessage = `Your amount should exist between ${currency}${this.data.product.price_min} and ${currency}${this.data.product.price_max}`;
      } else if (this.priceRange.invalid) {
        this.invalidInput = true;
        this.inputMessage = 'No price range specified for this amount';
      } else {
        this.invalidInput = false;
        this.inputMessage = `Our paying for this amount of product will be equal to ${currency}${this.priceRange.value}`;
      }
    });
  }

  cancel() {
    this.bottomSheetRef.dismiss();
  }

  confirm(enterAmount?: boolean) {
    let sendData;

    if (!this.hasBuyingPrice) {
      return;
    }

    if (enterAmount && (this.priceRange.invalid || !this.priceRange.value)) {
      return;
    }

    if (enterAmount) {
      sendData = { serial: this.data.serial, price: this.priceRange.value };
    } else {
      sendData = {
        serial: this.data.serial,
        price: this.data.product.price_min,
      };
    }

    this.checkPin(sendData);
  }

  choosePrice(price) {
    const dialogRef = this.dialog.open(MessageDialogComponent, {
      minWidth: '300px',
      maxWidth: '500px',
      panelClass: 'backdropBackground',
      data: {
        title: '',
        confirm: 'Confirm',
        cancel: 'Cancel',
        description: `Do you confirm to activate this card with amount ${this.data.product.currency_data.symbol}${price}?`,
      },
    });

    dialogRef.afterClosed().subscribe((data) => {
      if (data?.confirm) {
        let sendData = { serial: this.data.serial, price };
        this.checkPin(sendData);
      }
    });
  }

  checkPin(sendData) {
    let hasPin = this.permission.permissionInitInfo.profile.pin_required;
    if (hasPin) {
      this.openPinCode(sendData);
    } else {
      this.activateCard(sendData);
    }
  }

  activateCard(sendData) {
    this.shopService.activateSingle(sendData).subscribe(
      (data) => {
        this.registerService
          .createEventLog(EventType.PHYSICAL_ORDER, {
            transaction_id: data.id,
            status: data.status,
          })
          .subscribe();
        this.cancel();
        this.snackBarService.showSnackBar(
          'Single card activated successfully',
          'primary',
          2000
        );
      },
      (error) => {
        if (error.error.code === '617') {
          this.openErrorDialog(sendData);
        } else {
          this.cancel();
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
        this.activateCard(sendData);
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
