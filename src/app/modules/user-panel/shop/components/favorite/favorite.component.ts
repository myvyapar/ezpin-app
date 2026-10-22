import { Component, OnInit } from '@angular/core';
import { Product } from '../../models/products.model';
import { ShopService } from '../../services/shop.service';
import { Location } from '@angular/common';

@Component({
  selector: 'app-favorite',
  templateUrl: './favorite.component.html',
  styleUrls: ['./favorite.component.scss'],
})
export class FavoriteComponent implements OnInit {
  products: Product[] = [];
  isFinish: boolean = false;
  offset: number = 0;
  limit: number = 20;
  isScroll: boolean = true;

  constructor(private shopService: ShopService, private _location: Location) {}

  ngOnInit(): void {
    this.getFavoriteList();
  }

  getFavoriteList() {
    this.shopService
      .getFavoriteList({ limit: 1000, offset: 0, card_type: 2 })
      .subscribe((data) => {
        this.products = this.products.concat(data.results);
        if (!data.next) {
          this.isFinish = true;
        }
        this.isScroll = false;
        this.offset += 20;
      });
  }

  onScroll() {
    if (!this.isScroll && !this.isFinish) {
      this.isScroll = true;
      this.getFavoriteList();
    }
  }

  backStep() {
    this._location.back();
  }
}
