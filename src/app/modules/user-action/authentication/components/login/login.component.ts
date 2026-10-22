import { Component, OnDestroy, OnInit, Renderer2 } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { environment } from 'src/environments/environment';
import { Server } from '../../models/server.model';
import { LoginService } from './../../services/login.service';
import { LocalStorageService } from 'src/app/modules/shared/services/storage/local-storage.service';
import { MatDialog } from '@angular/material/dialog';
import { ForgetPasswordComponent } from '../forget-password/forget-password.component';
import { SnackBarService } from 'src/app/modules/shared/services/snack-bar.service';
import { Router } from '@angular/router';
import { DynamicScript } from 'src/app/modules/shared/services/dynamic-script.service';
import { RegistersService } from 'src/app/modules/shared/services/registers/registers.service';
import { EventType } from 'src/app/modules/shared/models/logs.model';
import { StateService } from 'src/app/modules/shared/services/storage/state.service';
import { Subscription, interval } from 'rxjs';
import { takeWhile } from 'rxjs/operators';

declare var grecaptcha: any;
const captchaCode = environment.captchaCode;
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit {
  selected: Server;
  serverList: Server[] = [];
  subscriptions: Subscription[] = [];
  loginForm: FormGroup;
  twoStepForm: FormGroup;

  hasCode: boolean = false;
  isNeedLoginMethod: boolean = false;
  isTwoFactorRequired: boolean = false;

  loginMethods: any;
  method: number | string
  responseMessage = ''

  remainingTime = {
    timer: 120000,
    seconds: "00",
    minutes: "02",
  };

  constructor(
    private loginService: LoginService,
    private localStorageService: LocalStorageService,
    public dialog: MatDialog,
    private snackBarService: SnackBarService,
    private router: Router,
    private dynamicScript: DynamicScript,
    private registersService: RegistersService,
    private stateService: StateService,
    private dynamicScriptService :DynamicScript,
    private renderer: Renderer2
  ) {
    this.loadRecaptchaScript()
  }

  ngOnInit(): void {
    this.renderer.removeClass(document.body,'recaptcha-hide')
    this.renderer.addClass(document.body, 'recaptcha');
    this.initForm();
    // this.stateService.startLoading();
    // this.initCaptcha();
    this.getServerList();
  }

  ngOnDestroy() {
    this.renderer.removeClass(document.body,'recaptcha')
    this.renderer.addClass(document.body, 'recaptcha-hide');
  }

  loadRecaptchaScript() {
    this.dynamicScriptService.loadReCaptcha()
  }

  // initCaptcha() {
  //   this.dynamicScript
  //     .loadReCaptcha()
  //     .then(() => {
  //       this.getCaptcha();
  //     })
  //     .catch(() => {
  //       this.initCaptcha();
  //     });
  // }

  initForm() {
    this.loginForm = new FormGroup({
      username: new FormControl('', Validators.required),
      password: new FormControl('', Validators.required),
      code: new FormControl(''),
    });

    this.twoStepForm = new FormGroup({
      code: new FormControl("", { validators: Validators.required }),
    });
  }

  get form() {
    return this.loginForm.controls;
  }

  // getCaptcha(): void {
  //   setTimeout(() => {
  //     if (
  //       typeof grecaptcha === 'undefined' ||
  //       typeof grecaptcha.render === 'undefined'
  //     ) {
  //       this.getCaptcha();
  //     } else {
  //       grecaptcha.render('g-recaptcha', {
  //         sitekey: environment.site_key,
  //       });
  //       this.stateService.endLoading();
  //     }
  //   }, 500);
  // }

  getServerList() {
    this.loginService.getServerList().subscribe((data) => {
      this.serverList = data;
      this.selected = data[0];
    });
  }

  login() {
    let isHuman: string;
    const getCaptchaToken = new Promise((resolve, reject) => {
      this.stateService.startLoading();
      grecaptcha.ready(() => {
        grecaptcha.execute(captchaCode, { action: 'submit' }).then((token) => {
          if (token) {
            isHuman = token;
            resolve('');
          } else {
            reject('');
          }
        });
      });
    });

    this.localStorageService.setItem(
      'baseUrl',
      `${this.selected?.base_url}api/v1`
    );

    getCaptchaToken.then(() => {
      this.stateService.endLoading();
      if (isHuman && this.loginForm.valid) {
        const user = {
          username: this.form.username.value,
          password: this.form.password.value,
          captcha: isHuman,
          code: this.form.code.value,
        };
        if (!this.hasCode) {
          delete user.code;
        }

        this.loginService.userLogin(user).subscribe(
          (data) => {
            if (data.code === '640') {
              this.snackBarService.showSnackBar(
                'Please insert your code',
                'primary',
                2000
              );
              this.hasCode = true;
            } else {
              if(data.access == '') {
                this.isNeedLoginMethod = true;
                this.loginMethods = data;
              } else {
                this.isNeedLoginMethod = false
                this.localStorageService.setItem('accessToken', data.access);
                this.localStorageService.setItem('refreshToken', data.refresh);
                this.registersService
                  .createEventLog(
                    EventType.LOGIN,
                    {},
                    { username: user.username, region: this.selected.id }
                  )
                  .subscribe();
                this.router.navigate(['/panel']);
              }
            }
          },
          (error) => {
            this.registersService
              .createEventLog(EventType.LOGIN_ERROR, {
                username: user.username,
                password: user.password,
              })
              .subscribe();
            // grecaptcha.reset();
          }
        );
      }
    });
  }

  onSubmitStepTwo(method?: number) {
    if (method) {
      this.method = method;
      const user = {
        ...this.loginForm.value,
        method: method,
      };
      this.loginService.userLoginStepTwo(user).subscribe(
        (res) => {
          this.isTwoFactorRequired = true

          if(method != 3) {
            this.responseMessage = res?.detail;
            this.startTimer()
          }
        },
        (error) => {
          this.snackBarService.showSnackBar(error.detail, 'warn', 2000);
        }
      );
    } else {
      this.isTwoFactorRequired = true;
      this.method = 3;
    }
  }

  codeInject() {
    let isHuman: string;
    const getCaptchaToken = new Promise((resolve, reject) => {
      this.stateService.startLoading();
      grecaptcha.ready(() => {
        grecaptcha.execute(captchaCode, { action: "submit" }).then((token) => {
          if (token) {
            isHuman = token;
            resolve("");
          } else {
            reject("");
          }
        });
      });
    });

    getCaptchaToken.then(() => {
      this.stateService.endLoading();
      if (isHuman) {
        let user = {
          ...this.loginForm.value,
          method: this.method,
          code: this.twoStepForm.controls.code.value,
          captcha: isHuman,
        };

        this.loginService.userLoginStepThree(user).subscribe(
          (data) => {
            this.localStorageService.setItem('accessToken', data.access);
            this.localStorageService.setItem('refreshToken', data.refresh);
            this.router.navigate(['/panel'])
          },
          (error) => {
            this.snackBarService.showSnackBar(error.error.detail, 'warn', 2000);
          }
        );
      } else {
        this.snackBarService.showSnackBar("Please check your entries!", 'warn', 2000);
      }
    });
  }


  startTimer() {
    this.remainingTime = {
      timer: 120000,
      seconds: "00",
      minutes: "02",
    };
    this.unsubscribeSubscriptions();
    const source = interval(1000);
    const remainTimer = source
      .pipe(takeWhile((val) => this.unsubscribeTimer()))
      .subscribe((val) => {
        let seconds = this.remainingTime.timer / 1000;
        let minutes = parseInt(`${seconds / 60}`);
        seconds = parseInt(`${seconds % 60}`);
        this.remainingTime.seconds =
          seconds < 10 ? "0" + seconds : `${seconds}`;
        this.remainingTime.minutes =
          minutes < 10 ? "0" + minutes : `${minutes}`;
        this.remainingTime.timer -= 1000;
      });

    this.subscriptions.push(remainTimer);
  }

  unsubscribeTimer() {
    return this.remainingTime.timer < 1 ? false : true;
  }

  resendCode() {
    const user = {
      ...this.loginForm.value,
      method: this.method,
    };
    this.loginService.userLoginStepTwo(user).subscribe(
      (res) => {
        this.responseMessage = res.detail;
        this.startTimer();
      },
      (error) => {
        this.snackBarService.showSnackBar(error.detail, 'warn', 2000);
      }
    );
  }

  unsubscribeSubscriptions() {
    if (this.subscriptions.length > 0) {
      this.subscriptions.forEach((subscription) => {
        subscription.unsubscribe();
      });
    }
  }


  openDialog(): void {
    const dialogRef = this.dialog.open(ForgetPasswordComponent, {
      minWidth: '300px',
      maxWidth: '500px',
      panelClass: 'full-with-dialog',
    });
  }
}
