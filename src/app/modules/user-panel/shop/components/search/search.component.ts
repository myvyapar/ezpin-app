import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Product } from '../../models/products.model';
import { ShopService } from '../../services/shop.service';
import { Location } from '@angular/common';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.scss'],
})
export class SearchComponent implements OnInit {
  searchForm: FormGroup;
  products: Product[] = [];
  isFinish: boolean = false;
  offset: number = 0;
  limit: number = 20;
  isScroll: boolean = true;
  emptyList: boolean = false;

  constructor(private shopService: ShopService, private _location: Location) {}

  ngOnInit(): void {
    this.initForm();
  }

  initForm() {
    this.searchForm = new FormGroup({
      search: new FormControl('', Validators.required),
    });
  }

  submitForm() {
    if (this.searchForm.invalid) {
      return;
    }

    this.offset = 0;
    this.emptyList = false;
    this.shopService
      .getSearchList({
        limit: 1000,
        offset: 0,
        card_type: 2,
        search: this.searchForm.get('search').value,
      })
      .subscribe((data) => {
        this.products = data.results;
        if (data.results.length < 1) {
          this.emptyList = true;
        }
        if (!data.next) {
          this.isFinish = true;
        }
        this.isScroll = false;
        this.offset += 20;
      });
  }

  getSearchProducts() {
    this.shopService
      .getSearchList({
        limit: this.limit,
        offset: this.offset,
        card_type: 2,
        search: this.searchForm.get('search').value,
      })
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
    if (!this.isScroll && !this.isFinish && this.searchForm.valid) {
      this.isScroll = true;
      this.getSearchProducts();
    }
  }

  backStep() {
    this._location.back();
  }
}
