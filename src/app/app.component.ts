import { ChangeDetectorRef, Component } from '@angular/core';
import {
  NavigationEnd,
  NavigationStart,
  Router,
  Event,
  NavigationError,
  NavigationCancel,
} from '@angular/router';
import { StateService } from './modules/shared/services/storage/state.service';
import { RegistersService } from './modules/shared/services/registers/registers.service';
import { LocalStorageService } from './modules/shared/services/storage/local-storage.service';
import { SnackBarService } from './modules/shared/services/snack-bar.service';
import { SwUpdate } from '@angular/service-worker';
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  title = 'EZPIN';
  public showLoading: boolean;
  public isBlock: boolean = false;
  public isOffline: boolean = false;
  constructor(
    private stateService: StateService,
    private router: Router,
    private cdr: ChangeDetectorRef,
    private registerService: RegistersService,
    private localStorageService: LocalStorageService,
    private snackBarService: SnackBarService,
    swUpdate: SwUpdate
  ) {
    swUpdate.available.subscribe(() => {
      swUpdate.activateUpdate().then(() => document.location.reload());
    });
  }

  ngOnInit() {
    this.checkConnection();
    this.checkLoading();
    this.checkRoute();
    this.registerDevice();
  }

  checkConnection() {
    if (!navigator.onLine) {
      this.snackBarService.showSnackBar(
        'Your connection is lost! Please try again later.',
        'warn',
        4000
      );
      this.isOffline = true;
    }
    window.addEventListener('online', () => {
      this.isOffline = false;
    });
    window.addEventListener('offline', () => {
      this.snackBarService.showSnackBar(
        'Your connection is lost! Please try again later.',
        'warn',
        4000
      );
      this.isOffline = true;
    });
  }

  checkDevice() {
    this.registerService.checkDevice().subscribe(
      (data) => {
        this.isBlock = data.is_block;
        if (this.isBlock) {
          this.snackBarService.showSnackBar(
            'Your device is blocked!',
            'warn',
            4000
          );
        }
      },
      (error) => {
        this.snackBarService.showSnackBar(error.error.error, 'warn', 2000);
        this.isBlock = true;
      }
    );
  }

  registerDevice() {
    const registerToken = this.localStorageService.getItem('register-token');
    if (registerToken) {
      this.checkDevice();
    } else {
      this.registerService.registerDevice().subscribe((data) => {
        this.localStorageService.setItem('register-token', data.token);
        this.checkDevice();
      });
    }
  }

  checkLoading() {
    this.stateService.getLoadingStatus().subscribe((loadingStatus) => {
      this.showLoading = loadingStatus;
      this.cdr.detectChanges();
    });
  }

  checkRoute() {
    this.router.events.subscribe((event: Event) => {
      if (event instanceof NavigationStart) {
        this.stateService.startLoading();
      }
      if (
        event instanceof NavigationEnd ||
        event instanceof NavigationError ||
        event instanceof NavigationCancel
      ) {
        this.stateService.endLoading();
      }
    });
  }
}
