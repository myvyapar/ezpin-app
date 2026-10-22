import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Region } from 'src/app/modules/user-panel/shop/models/regions.model';

@Injectable({
  providedIn: 'root',
})
export class StateService {
  public showLoading = new BehaviorSubject<boolean>(false);
  public count: number = 0;
  public isLoadedWidget = new BehaviorSubject<boolean>(false);
  public region = new BehaviorSubject<Region>(null);
  constructor() { }

  getLoadingStatus(): Observable<boolean> {
    return this.showLoading.asObservable();
  }

  getLastRegion(): Observable<Region> {
    return this.region.asObservable();
  }

  getWidgetStatus(): Observable<boolean> {
    return this.isLoadedWidget.asObservable();
  }

  setRegion(region: Region) {
    this.region.next(region);
  }

  loadedWidget() {
    this.isLoadedWidget.next(true);
  }

  startLoading() {
    this.count += 1;
    this.checkLoadingStatus();
  }

  endLoading() {
    this.count -= 1;
    this.checkLoadingStatus();
  }

  checkLoadingStatus() {
    if (this.count < 0) {
      this.count = 0
    }

    if (this.count < 1) {
      this.showLoading.next(false);
    } else {
      this.showLoading.next(true);
    }
  }
}
