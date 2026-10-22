import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { StateService } from 'src/app/modules/shared/services/storage/state.service';
import { Region } from '../../shop/models/regions.model';
import { ShopService } from '../../shop/services/shop.service';

@Component({
  selector: 'app-regions',
  templateUrl: './regions.component.html',
  styleUrls: ['./regions.component.scss']
})
export class RegionsComponent implements OnInit {
  allRegion:Region = {
    code:'All',
    id:0,
    image:'',
    name:'All',
    phone_prefix:''
  }
  constructor(
    public dialogRef: MatDialogRef<RegionsComponent>,
    @Inject(MAT_DIALOG_DATA) public data,
    private stateService:StateService
  ) { }

  ngOnInit(): void {
  }

  selectRegion(region){
    this.stateService.setRegion(region);
    this.dialogRef.close();
  }

}
