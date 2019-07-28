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
  // order: any = {
  //   token: '',
  //   company_invoice: '',
  //   purchase_date: ''
  // };
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
    private alertS: AlertService
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
    if (this.purchaseOrder !== '') {
      this.purchaseOrder = JSON.parse(this.purchaseOrder);
     // this.order = this.purchaseOrder;
    }
    this.items = localStorage.getItem('purchaseItem');
    if (this.items !== '') {
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
      //console.log(this.form.value.medicines.length);
      // this.validationCheck();
      // this.emptyCheck(this.form.value);
      // this.manualOrder.items = this.form.value;

      if (this.validationStatus) {
        this.cartS
          .manualOrder(this.order)
          .then(res => {
            if (res.success === true) {
              Swal.fire({
                position: "center",
                type: "success",
                title: "Orders successfully submitted.",
                showConfirmButton: false,
                timer: 1500
              });
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
    // console.log(this.orderItem);
    // this.orderItem.batches.push(this.item.batch_no);
    // this.orderItem.exps.push(this.item.exp_date);
    // this.orderItem.quantities.push(this.item.quantity);
    // this.orderItem.medicines.push(this.item.medicine);
    // this.orderItem.mfgs.push('');
    // this.orderItem.totals.push('');

    // console.log(this.orderItem);
    // this.order.items.push(this.item);

    // console.log(this.order);
    //this.purchaseOrder.items.push(this.item);
    this.items.push(this.orderItem);
    this.cartS.saveOrderInlocalStorage(this.order);
    this.cartS.savePurchaseItemInlocalStorage(this.items);
    // $('#myForm').trigger('reset');
    // const token = localStorage.getItem('token');
    // this.cartItem.token = token ? token : '';

    // this.cartS.addtoCart(this.cartItem).then(
    //   res => {
    //     if (res.success === true) {
    //       // $('#myForm').trigger('reset');
    //       this.alertS.success(this.alertContainer, 'Medicine has been added to cart', true, 3000);
    //       this.cartS.saveCartsInlocalStorage(res.data);
    //       localStorage.setItem('token', res.data.token);

    //       this.productList = res.data;

    //       // this.cartS.cartReload.next({ reload: true, items: res.result.data.cart_items });
    //       this.cartLoad = false;
    //     }
    //   }
    // ).catch(
    //   err => {
    //     this.cartLoad = false;
    //     this.alertS.error(this.alertContainer, 'Medicine has not been added to cart', true, 3000);
    //   }
    // );
  }
  decreaseQuant(cart, i) {
    if (cart.quantity > 1) {
      this.increament = i;
      const obj = {
        id: cart.id,
        token: this.productList.token,
        sales_tax: cart.sales_tax,
        increment: 0,
        price: cart.price,
        rental_duration: cart.rental_duration
      };
      this.updateCartQunt(obj);
    }
  }

  increaseQuant(cart, i) {
    this.increament = i;
    const obj = {
      id: cart.id,
      token: this.productList.token,
      increment: 1
    };
    this.updateCartQunt(obj);
  }

  updateCartQunt(data) {
    console.log(data);
    this.cartS
      .updateCart(data)
      .then(res => {
        if (res.success === true) {
          this.productList = res.data;
          this.cartS.saveCartsInlocalStorage(res.data);
          $('custom-alert').css('display', 'block');
          this.alertS.success(
            this.alertContainer,
            'Cart Updated Successfully',
            true,
            3000
          );
        } else {
          $('custom-alert').css('display', 'block');
          this.alertS.error(
            this.alertContainer,
            'Something wrong !! Please try again ',
            true,
            3000
          );
        }
        this.increament = null;
      })
      .catch(err => {
        console.log(err);
        $('custom-alert').css('display', 'block');
        this.alertS.error(
          this.alertContainer,
          'Something wrong !! Please try again',
          true,
          3000
        );
        this.increament = null;
      });
  }

  removeItem(itemId) {
    this.cartS.deleteCart(itemId, localStorage.getItem('token')).then(
      res => {
        if (res.success === true) {
          this.alertS.success(this.alertContainer, 'Item successfull deleted', true, 3000);
          this.cartS.saveCartsInlocalStorage(res.data);
          localStorage.setItem('token', res.data.token);

          this.productList = res.data;
        }
      }
    ).catch(
      err => {
        this.alertS.error(this.alertContainer, err.error.error, true, 3000);
      }
    );
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
