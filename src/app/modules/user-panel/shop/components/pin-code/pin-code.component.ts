import { Component, Inject, OnInit } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-pin-code',
  templateUrl: './pin-code.component.html',
  styleUrls: ['./pin-code.component.scss']
})
export class PinCodeComponent implements OnInit {
  pinCode = new FormControl('', [Validators.required, Validators.minLength(4), Validators.maxLength(4)]);

  constructor(
    public dialogRef: MatDialogRef<PinCodeComponent>,
    @Inject(MAT_DIALOG_DATA) public data,
    public dialog: MatDialog,
  ) { }

  ngOnInit(): void {
    this.onChangeInput();
  }

  onChangeInput(): void {
    this.pinCode.valueChanges.subscribe(value => {
      if (value.length === 4) {
        this.submitForm(value);
      }
    });
  }

  submitForm(pinCode) {
    this.dialogRef.close({ pinCode })
  }

}
