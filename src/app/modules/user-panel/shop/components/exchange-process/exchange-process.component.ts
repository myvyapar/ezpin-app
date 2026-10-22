import { Component, Inject, OnInit } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { SnackBarService } from 'src/app/modules/shared/services/snack-bar.service';
import { ExchangeRates } from '../../models/exchange-rate.mode';
import { ShopService } from '../../services/shop.service';

@Component({
  selector: 'app-exchange-process',
  templateUrl: './exchange-process.component.html',
  styleUrls: ['./exchange-process.component.scss']
})
export class ExchangeProcessComponent implements OnInit {
  selectedRange: ExchangeRates;
  amount: number;
  showExchangeDetail: boolean = false;

  constructor(
    private snackBarService: SnackBarService,
    public dialogRef: MatDialogRef<ExchangeProcessComponent>,
    @Inject(MAT_DIALOG_DATA) public data,
    public dialog: MatDialog,
    private shopService: ShopService
  ) { }

  ngOnInit(): void {

  }

  submitExchange() {
    this.dialogRef.close({ isFinishExchange: true })
  }

  getRanges() {
    this.shopService.getExchangeRanges().subscribe(data => {
      this.findRange(data)
    })
  }

  findRange(ranges: ExchangeRates[]) {
    this.selectedRange = ranges.find(el => {
      return el.to_currency_data.symbol === this.data.currency
    })

    if (!this.selectedRange) {
      this.snackBarService.showSnackBar(
        'Exchange rate not found!',
        'primary',
        2000
      );
      this.dialogRef.close()
      return
    }
    this.calcAmount();
    this.showExchangeDetail = true;
  }

  calcAmount() {
    this.amount = (Math.round((this.data.total * 100) / this.selectedRange.rate)) / 100;
  }

  confirmExchange() {
    let sendData = {
      amount: this.amount,
      from_currency: this.selectedRange.from_currency_data.id,
      to_currency: this.selectedRange.to_currency_data.id
    }

    this.shopService.financeExchange(sendData).subscribe(data => {
      this.dialogRef.close({ isFinishExchange: true })
    })
  }

  cancel() {
    this.dialogRef.close();
  }
}
