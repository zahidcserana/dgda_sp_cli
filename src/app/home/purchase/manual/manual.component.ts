import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';
import { Subscription, Observable } from 'rxjs';
import { ScriptLoaderService } from '../../../_services/script-loader.service';
import { Router, ActivatedRoute } from '@angular/router';
import { CartService } from '../../cart-service/cart.service';
import { AlertService } from '../../../modules/alert/alert.service';
import * as $ from 'jquery';
import { debounceTime, distinctUntilChanged, map, tap, switchMap, catchError } from 'rxjs/operators';
import { OrderModel, OrderItemModel } from '../models/order.model';
import Swal from 'sweetalert2';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-manual',
  templateUrl: './manual.component.html',
  styleUrls: ['./manual.component.css']
})
export class ManualComponent implements OnInit {
  order: OrderModel = new OrderModel();
  orderItem: OrderItemModel = new OrderItemModel();
  item: any = {
    medicine: '',
    exp_date: '',
    quantity: '',
    batch_no: ''
  };

  medicineSearch: any = {
    company: '',
    search: ''
  };
  purchaseOrder;
  items;
  
  cartLoad: boolean;
  public model: any;
  loader_sub: boolean;
  loader: boolean;
  searchData: any[] = [];
  companyList: any[] = [];
  sub: Subscription;
  loading = false;
  productList;
  increament: number;
  validationStatus = true;

  @ViewChild('hasAlert') alertContainer: ElementRef;
  private product: null;

  constructor(
    private _script: ScriptLoaderService,
    private router: Router,
    private cartS: CartService,
    private route: ActivatedRoute,
    private alertS: AlertService,
    private datePipe: DatePipe
  ) {


  }

  ngOnInit() {
    console.log('purchase');
    this.order.purchase_date = new Date().toISOString().split("T")[0];
    this.sub = this.route.data.subscribe(
      val => {
        this.companyList = val && val['companies'] ? val['companies'] : [];
      }
    );
    this.purchaseOrder = localStorage.getItem('purchaseOrder');
    if (this.purchaseOrder !== null) {
      this.purchaseOrder = JSON.parse(this.purchaseOrder);
      this.order = this.purchaseOrder;
    }
    this.items = localStorage.getItem('purchaseItem');
    if (this.items !== null) {
      this.items = JSON.parse(this.items);
    }

  }
  name = "Angular";
  modelDate = "";

  onOpenCalendar(container) {
    container.monthSelectHandler = (event: any): void => {
      container._store.dispatch(container._actions.select(event.date));
    };
    container.setViewMode("month");
  }


  submitOrder() {
    if (confirm("Are you sure to submit.")) {
      this.purchaseOrder = localStorage.getItem('purchaseOrder');
      if (this.purchaseOrder !== null) {
        this.purchaseOrder = JSON.parse(this.purchaseOrder);
        this.order = this.purchaseOrder;
      }
      this.items = localStorage.getItem('purchaseItem');
      if (this.items !== null) {
        this.items = JSON.parse(this.items);
        this.order.items = this.items;
      }

      if (this.validationStatus) {
        this.cartS
          .manualPurchase(this.order)
          .then(res => {
            if (res.success === true) {
              Swal.fire({
                position: "center",
                type: "success",
                title: "Orders successfully submitted.",
                showConfirmButton: false,
                timer: 1500
              });
              localStorage.removeItem('purchaseOrder');
              localStorage.removeItem('purchaseItem');
              this.items = [];
              // this.alertS.success(this.alertContainer, 'Orders successfully submitted.', true, 3000);
              $(".validation-input").removeClass("invalid-input");
              // window.location.reload();
              $("#myForm").trigger("reset");
              $("input[name=company").val("");
              $("input[name=company_invoice").val("");
            } else {
              this.alertS.error(this.alertContainer, res.error, true, 3000);
            }
          })
          .catch(err => {
            console.log(err);
            this.alertS.error(this.alertContainer, err.error.error, true, 3000);
          });
      } else {
        Swal.fire({
          type: "warning",
          title: "Oops...",
          text: "Please enter all required field!"
        });
      }
    }
  }

  addToCart() {
    console.log(this.orderItem);

    this.orderItem.exp_date = this.datePipe.transform(new Date(this.orderItem.exp_date),"yyyy-MM-dd");


    let orderItems = [];

    if (localStorage.getItem('purchaseItem') !== null) {
      orderItems = JSON.parse(localStorage.getItem('purchaseItem'));

    }
    orderItems.push(this.orderItem);

    this.cartS.saveOrderInlocalStorage(this.order);
    this.cartS.savePurchaseItemInlocalStorage(orderItems);

    this.items = localStorage.getItem('purchaseItem');
    if (this.items !== null) {
      this.items = JSON.parse(this.items);
    }
    $('#myForm').trigger('reset');
  }

  company_search = (company$: Observable<string>) =>
    company$.pipe(
      debounceTime(200),
      distinctUntilChanged(),
      map(term => term.length < 2 ? []
        : this.companyList.filter(v => v.toLowerCase().indexOf(term.toLowerCase()) > -1).slice(0, 10))
    );

  search = (text$: Observable<string>) => {
    return text$.pipe(
      debounceTime(300),
      distinctUntilChanged(),
      tap(() => {
        this.searchData = [];
        this.loader_sub = true;
      }),
      switchMap(term => {
        this.loader_sub = true;
        this.medicineSearch.company = this.order.company;
        this.medicineSearch.search = term.trim();

        return this.getMedicineList(this.medicineSearch);
      }),
    );
  };

  private getMedicineList(params): any {
    if (!params && params === '') {
      this.loader_sub = false;
      return [];
    }

    return this.cartS.searchMedicine(params).pipe(
      map(res => {
        this.loader_sub = false;
        this.searchData = res;
        return this.searchData;
      }),
      catchError(() => {
        this.loader_sub = false;
        return [];
      })
    );
  }

}
