import { Component, OnInit } from '@angular/core';
import { Permission } from 'src/app/modules/shared/models/permission.model';
import { SharedService } from 'src/app/modules/shared/services/shared.service';

@Component({
  selector: 'app-user-menu',
  templateUrl: './user-menu.component.html',
  styleUrls: ['./user-menu.component.scss']
})
export class UserMenuComponent implements OnInit {
  userInfo: Permission;
  constructor(private sharedService: SharedService) { }

  ngOnInit(): void {
    this.getUserInfo();
  }

  getUserInfo() {
    this.sharedService.getUserPermissions().subscribe((data) => {
      this.userInfo = data;
    });
  }
}
