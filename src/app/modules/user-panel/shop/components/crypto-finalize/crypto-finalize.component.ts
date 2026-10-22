import {
  Component,
  EventEmitter,
  Input,
  OnDestroy,
  OnInit,
  Output,
} from '@angular/core';
import { Order } from '../../models/crypto-order.model';
import { ConvertTimezone } from 'src/app/modules/shared/pipes/convert-timezone.pipe';
import { DatePipe } from '@angular/common';
import { interval, Subscription } from 'rxjs';
import { FormControl, Validators } from '@angular/forms';
import { ShopService } from '../../services/shop.service';
import { PermissionResolverService } from 'src/app/modules/shared/services/resolver/permission-resolver.service';
import { RegistersService } from 'src/app/modules/shared/services/registers/registers.service';
import { EventType } from 'src/app/modules/shared/models/logs.model';

@Component({
  selector: 'crypto-finalize',
  templateUrl: './crypto-finalize.component.html',
  styleUrls: ['./crypto-finalize.component.scss'],
})
export class CryptoFinalizeComponent implements OnInit, OnDestroy {
  @Input() order: Order;
  @Output() reduceStep = new EventEmitter<boolean>();
  remaining = { minutes: '', seconds: '' };
  selectedPay: string = 'pin';
  selectedPin: string = 'sms';
  userInfo = new FormControl('');
  inputPlaceholder: string = '';
  subscription: Subscription;

  constructor(
    private convertTimeZone: ConvertTimezone,
    private datePipe: DatePipe,
    private shopService: ShopService,
    private permissionResolverService: PermissionResolverService,
    private registerService: RegistersService
  ) {}

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  ngOnInit(): void {
    this.setTimer();
    this.selectPay('pin');
  }

  selectPay(type: string) {
    this.selectedPay = type;
    if (this.selectedPay == 'pin') {
      this.selectPin('phone');
    } else {
      this.selectPin('crypto_wallet');
      this.userInfo.setValidators([Validators.required]);
      this.userInfo.patchValue('');
      this.inputPlaceholder = 'Wallet Address';
    }
  }

  selectPin(type: string) {
    this.selectedPin = type;
    if (this.selectedPin == 'email') {
      this.userInfo.setValidators([Validators.required, Validators.email]);
      this.userInfo.patchValue('');
      this.inputPlaceholder = 'Email Address';
    } else if (this.selectedPin == 'whatsapp') {
      this.userInfo.setValidators([
        Validators.required,
        Validators.pattern(
          '(([+][(]?[0-9]{1,3}[)]?)|([(]?[0-9]{4}[)]?))s*[)]?[-s.]?[(]?[0-9]{1,3}[)]?([-s.]?[0-9]{3})([-s.]?[0-9]{3,4})'
        ),
      ]);
      this.userInfo.patchValue(
        this.permissionResolverService.permissionInitInfo.profile.city.state
          .country.phone_prefix
      );
      this.inputPlaceholder = 'Whatsapp Number';
    } else {
      this.userInfo.setValidators([
        Validators.required,
        Validators.pattern(
          '(([+][(]?[0-9]{1,3}[)]?)|([(]?[0-9]{4}[)]?))s*[)]?[-s.]?[(]?[0-9]{1,3}[)]?([-s.]?[0-9]{3})([-s.]?[0-9]{3,4})'
        ),
      ]);
      this.userInfo.patchValue(
        this.permissionResolverService.permissionInitInfo.profile.city.state
          .country.phone_prefix
      );
      this.inputPlaceholder = 'Phone Number';
    }
  }

  setTimer() {
    let currentDate = this.convertTimeZone.transform(new Date()).date;
    let currentTime = this.convertTimeZone.transform(new Date()).time;
    let current = new Date(`${currentDate} ${currentTime}`);
    let createdDate = this.convertTimeZone.transform(
      this.datePipe.transform(this.order.created_time, 'MMMM d, y, h:mm:ss a z')
    ).date;
    let createdTime = this.convertTimeZone.transform(
      this.datePipe.transform(this.order.created_time, 'MMMM d, y, h:mm:ss a z')
    ).time;
    let created = new Date(`${createdDate} ${createdTime}`);
    let remaining = Math.abs(Number(current) - Number(created));
    let timer = 300000 - remaining;
    this.updateTimer(timer);
  }

  updateTimer(remainingTime: number) {
    if (remainingTime < 0) {
      this.backStep();
    }
    const source = interval(1000);
    this.subscription = source.subscribe((val) => {
      let seconds = remainingTime / 1000;
      let minutes = parseInt(`${seconds / 60}`);
      seconds = parseInt(`${seconds % 60}`);
      this.remaining.seconds = seconds < 10 ? '0' + seconds : `${seconds}`;
      this.remaining.minutes = minutes < 10 ? '0' + minutes : `${minutes}`;
      remainingTime -= 1000;
      if (remainingTime < 0) {
        this.backStep();
      }
    });
  }

  finalPay() {
    if (this.userInfo.invalid) {
      return;
    }

    let sendData;
    if (this.selectedPay == 'address') {
      sendData = { crypto_wallet: this.userInfo.value };
    } else {
      sendData = { [this.selectedPin]: this.userInfo.value };
    }

    this.shopService
      .finalizeOrder(this.order.id, sendData)
      .subscribe((data) => {
        this.registerService
          .createEventLog(EventType.CRYPTO_FINALIZE, {
            order: this.order.id,
            response_code: data.code,
          })
          .subscribe();
        this.backStep();
      });
  }

  backStep() {
    this.reduceStep.emit(true);
  }
}
