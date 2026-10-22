import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-wallet-order-detail',
  templateUrl: './wallet-order-detail.component.html',
  styleUrls: ['./wallet-order-detail.component.scss']
})
export class WalletOrderDetailComponent implements OnInit {

  constructor(
    public dialogRef: MatDialogRef<WalletOrderDetailComponent>,
    @Inject(MAT_DIALOG_DATA) public data,
  ) { }

  ngOnInit(): void {
  }

}
