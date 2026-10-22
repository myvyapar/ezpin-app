import {
  AfterViewInit,
  Component,
  ElementRef,
  HostListener,
  OnInit,
  Renderer2,
  ViewChild,
} from '@angular/core';
import { filter } from 'rxjs/operators';
import { Event, Router, RouterEvent, NavigationStart } from '@angular/router';
import { Category } from '../../models/category.model';
import { ShopService } from '../../services/shop.service';
import { Product } from '../../models/products.model';
import { Location } from '@angular/common';
import { StateService } from 'src/app/modules/shared/services/storage/state.service';
import { Region } from '../../models/regions.model';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-egift',
  templateUrl: './egift.component.html',
  styleUrls: ['./egift.component.scss'],
})
export class EgiftComponent implements OnInit, AfterViewInit {
  categoryList: Category[];
  ProductCategory: Category[];
  categories: Category[];
  products: Product[] = [];
  selectedCategory: number;
  isProductCategory: boolean = false;
  isProductList: boolean = false;
  previousRoute: string = '';
  scrollPosition: number = 0;
  region: Region;
  regionSubscription: Subscription;

  constructor(
    private shopService: ShopService,
    private render: Renderer2,
    private router: Router,
    private _location: Location,
    private stateService: StateService
  ) {}

  // onScroll() {
  //   if (!this.isScroll && !this.isFinish && this.isProductList) {
  //     this.isScroll = true;
  //     this.getProductList(this.selectedCategory);
  //   }
  // }

  ngAfterViewInit(): void {
    this.router.events
      .pipe(
        filter((e: Event): e is NavigationStart => e instanceof NavigationStart)
      )
      .subscribe((e: RouterEvent) => {
        this.setRoute(e);
      });
  }

  ngOnInit(): void {
    this.checkRoute();
    this.getCategoryList();
    this.checkRegion();
  }

  ngOnDestroy() {
    this.regionSubscription.unsubscribe();
  }

  checkRoute() {
    if (this.router.url != 'panel/shop') {
      this.router.navigate(['panel/shop']);
    }
  }

  checkRegion() {
    this.regionSubscription = this.stateService
      .getLastRegion()
      .subscribe((res) => {
        if (res) {
          this.region = res;
          this.getCategoryList();
        }
      });
  }

  getCategoryList() {
    let params = {
      region: this.region?.id || '',
      methods: '2,5',
    };

    this.shopService.getCategoryList(params).subscribe((data) => {
      this.categoryList = data;
      this.categories = data;
    });
  }

  onCategoryClick(category: Category) {
    if (category.children.length > 0) {
      this.ProductCategory = category.children;
      this.categoryList = this.ProductCategory;
      this.isProductCategory = true;
      this.router.navigate(['/panel/shop'], {
        fragment: `category${category.id}`,
      });
      this.previousRoute = 'eGift';
    } else {
      this.getProductList(category.id);
    }
  }

  getProductList(category: number) {
    this.selectedCategory = category;
    if (this.isProductCategory) {
      this.previousRoute = 'category';
    } else {
      this.previousRoute = 'eGift';
    }

    this.shopService
      .getProductList({
        limit: 1000,
        offset: 0,
        category,
        allow_methods: '2,5',
        card_type: 2,
      })
      .subscribe((data) => {
        this.products = this.products.concat(data.results);
        this.isProductCategory = false;

        // if (!data.next) {
        //   this.isFinish = true;
        // }
        // this.isScroll = false;
        // this.offset += 20;

        this.router.navigate(['/panel/shop'], {
          fragment: `products${category}`,
        });
        this.isProductList = true;
      });
  }

  setRoute(e: RouterEvent) {
    if (
      e.url === '/panel/shop' ||
      (this.previousRoute === 'eGift' &&
        (this.isProductList || this.isProductCategory))
    ) {
      this.categoryList = this.categories;
      this.isProductList = false;
      this.isProductCategory = false;
      this.previousRoute = '';
      this.products = [];
      // this.offset = 0;
    } else if (this.previousRoute === 'category' && this.isProductList) {
      this.categoryList = this.ProductCategory;
      this.products = [];
      // this.offset = 0;
      this.previousRoute = 'eGift';
      this.isProductList = false;
      this.isProductCategory = true;
    }

    window.scrollTo(0, 0);
  }

  backStep() {
    this._location.back();
  }
}
