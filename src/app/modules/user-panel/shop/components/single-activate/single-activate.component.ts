import { Component, OnInit } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { MatBottomSheet } from '@angular/material/bottom-sheet';
import { ShopService } from '../../services/shop.service';
import { SingleActivateBottomSheetComponent } from '../single-activate-bottom-sheet/single-activate-bottom-sheet.component';

@Component({
  selector: 'single-activate',
  templateUrl: './single-activate.component.html',
  styleUrls: ['./single-activate.component.scss']
})
export class SingleActivateComponent implements OnInit {
  serialNumber = new FormControl('', [Validators.maxLength(30), Validators.minLength(30)]);
  isActiveButton: boolean = false;

  constructor(private shopService: ShopService, private bottomSheet: MatBottomSheet,) { }

  ngOnInit(): void {
    this.checkInputChange();
  }

  checkInputChange(): void {
    this.serialNumber.valueChanges.subscribe(value => {
      if (!value || this.serialNumber.invalid) {
        this.isActiveButton = false;
      }
      else {
        this.isActiveButton = true;
      }
    });
  }

  activateCard() {
    if (this.serialNumber.invalid) {
      return
    }

    this.shopService.checkCard({ serial: this.serialNumber.value }).subscribe(data => {
        this.bottomSheet.open(SingleActivateBottomSheetComponent, {
          data: data,
        });
    })
  }

}
