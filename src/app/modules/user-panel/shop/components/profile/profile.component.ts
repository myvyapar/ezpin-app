import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { SharedService } from 'src/app/modules/shared/services/shared.service';
import { Permission } from 'src/app/modules/shared/models/permission.model';
import { LocalStorageService } from 'src/app/modules/shared/services/storage/local-storage.service';
import { RegistersService } from 'src/app/modules/shared/services/registers/registers.service';
import { EventType } from 'src/app/modules/shared/models/logs.model';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss'],
})
export class ProfileComponent implements OnInit {
  userInfo: Permission;
  userName: string;
  userEmail: string;
  constructor(
    private _location: Location,
    private sharedService: SharedService,
    private localStorageService: LocalStorageService,
    private registerService: RegistersService
  ) {}

  ngOnInit(): void {
    this.getUserInfo();
  }

  getUserInfo() {
    this.sharedService.getUserPermissions().subscribe((data) => {
      if (data.sub_user) {
        this.userEmail = data.sub_user?.email || '';
        this.userName = data.sub_user?.name;
      } else {
        this.userEmail = data.profile?.username;
        this.userName = data.profile?.name;
      }
      this.userInfo = data;
    });
  }

  singOut() {
    this.registerService.createEventLog(EventType.LOGOUT).subscribe();
    this.localStorageService.logOutUser();
  }

  backStep() {
    this._location.back();
  }
}
