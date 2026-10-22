import { Component, Inject, OnInit } from '@angular/core';
import {
  MatBottomSheetRef,
  MAT_BOTTOM_SHEET_DATA,
} from '@angular/material/bottom-sheet';
import { PermissionResolverService } from 'src/app/modules/shared/services/resolver/permission-resolver.service';

@Component({
  selector: 'app-orders-resend',
  templateUrl: './orders-resend.component.html',
  styleUrls: ['./orders-resend.component.scss'],
})
export class OrdersResendComponent implements OnInit {
  adminEmail: string;
  subUserDetail;
  constructor(
    private permission: PermissionResolverService,
    private bottomSheetRef: MatBottomSheetRef<OrdersResendComponent>,
    @Inject(MAT_BOTTOM_SHEET_DATA) public data: any
  ) { }

  ngOnInit(): void {
    this.setAdminEmail();
    this.setSubUser();
  }

  setAdminEmail() {
    this.adminEmail = this.permission.permissionInitInfo.profile.email;
  }

  setSubUser() {
    this.subUserDetail = this.permission.permissionInitInfo.sub_user
  }

  submitResend(isAdmin,isSubUser) {
    let use_account_email = isAdmin;
    let use_sub_user_email = isSubUser;
    this.bottomSheetRef.dismiss({ use_account_email ,use_sub_user_email});
  }
}
