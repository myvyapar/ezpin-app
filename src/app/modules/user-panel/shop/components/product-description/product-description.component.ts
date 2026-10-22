import { Component, Inject, OnInit } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-product-description',
  templateUrl: './product-description.component.html',
  styleUrls: ['./product-description.component.scss']
})
export class ProductDescriptionComponent implements OnInit {

  constructor(
    public dialogRef: MatDialogRef<ProductDescriptionComponent>,
    @Inject(MAT_DIALOG_DATA) public data,
    public dialog: MatDialog,
  ) { }

  ngOnInit(): void {
  }

}
