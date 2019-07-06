import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {Helpers} from '../../helpers';
import {ScriptLoaderService} from '../../_services/script-loader.service';
import {Router, ActivatedRoute} from '@angular/router';
import * as $ from 'jquery';
import {catchError, debounceTime, distinctUntilChanged, map, switchMap, tap} from 'rxjs/operators';
import {Observable, Subscription} from 'rxjs';
import {CartService} from '../cart-service/cart.service';
import {AlertService} from '../../modules/alert/alert.service';

@Component({
    selector: 'app-purchase',
    templateUrl: './purchase.component.html',
    styleUrls: ['./purchase.component.css']
})
export class PurchaseComponent implements OnInit {
    cartItem: any = {
        medicine: '',
        company: '',
        quantity: '',
        token: ''
    };
    order: any = {
        token: ''
    };
    medicineSearch: any = {
        company: '',
        search: ''
    };
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

        this.sub = this.route.data.subscribe(
            val => {
                this.companyList = val && val['companies'] ? val['companies'] : [];
            }
        );

        const token = localStorage.getItem('token');
        this.cartItem.token = token ? token : '';
        console.log('token');
        if (this.cartItem.token !== '') {
            this.checkToken(this.cartItem.token);
        }
    }

    checkToken(token) {
        this.cartS.checkCart(this.cartItem.token)
            .subscribe(res => {
                if (res.status === true) {
                    this.cartS.cartDetails(this.cartItem.token).subscribe((data) => this.productList = data);

                } else {
                    localStorage.removeItem('user_cart');
                    localStorage.removeItem('token');
                    this.productList = [];
                }
            });
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

    submitOrder() {
        this.order.token = localStorage.getItem('token');
        this.cartS.makeOrder(this.order).then(
            res => {
                if (res.success === true) {
                    this.alertS.success(this.alertContainer, 'Orders successfully submitted.', true, 3000);
                    localStorage.removeItem('user_cart');
                    localStorage.removeItem('token');
                    this.productList = [];
                }
            }
        ).catch(
            err => {
                this.alertS.error(this.alertContainer, err.error.error, true, 3000);
            }
        );
    }

    addToCart() {
        const token = localStorage.getItem('token');
        this.cartItem.token = token ? token : '';

        this.cartS.addtoCart(this.cartItem).then(
            res => {
                if (res.success === true) {
                    $('#myForm').trigger('reset');
                    this.alertS.success(this.alertContainer, 'Medicine has been added to cart', true, 3000);
                    this.cartS.saveCartsInlocalStorage(res.data);
                    localStorage.setItem('token', res.data.token);

                    this.productList = res.data;

                    // this.cartS.cartReload.next({ reload: true, items: res.result.data.cart_items });
                    this.cartLoad = false;
                }
            }
        ).catch(
            err => {
                this.cartLoad = false;
                this.alertS.error(this.alertContainer, 'Medicine has not been added to cart', true, 3000);
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
                this.medicineSearch.company = this.cartItem.company;
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
