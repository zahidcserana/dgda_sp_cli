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
    }
    cartLoad: boolean;
    public model: any;
    loader_sub: boolean;
    loader: boolean;
    searchData: any[] = [];
    companyList: any[] = [];
    sub: Subscription;
    loading = false;
    productList;
    @ViewChild('hasAlert') alertContainer: ElementRef;

    constructor(
        private _script: ScriptLoaderService,
        private router: Router,
        private cartS: CartService,
        private route: ActivatedRoute,
        private alertS: AlertService
    ) {
        this.getSettings();

    }

    ngOnInit() {
        this.sub = this.route.data.subscribe(
            val => {
                this.companyList = val && val['companies'] ? val['companies'] : [];
            }
        );

        const token = localStorage.getItem('token');
        this.cartItem.token = token ? token : '';
        console.log('token');
        if (this.cartItem.token !== '') {
            this.cartS.cartDetails(this.cartItem.token).subscribe((data) => this.productList = data);
        }
    }

    remove(item_id){
        console.log(item_id);
        this.cartS.deleteCart(item_id);
    }

    submitOrder(){
        this.order.token = localStorage.getItem('token');
        this.cartS.makeOrder(this.order).then(
            res => {
                if(res.success === true){
                    this.alertS.success(this.alertContainer, 'Orders successfully submitted.', true, 3000);
                    localStorage.removeItem('user_cart');
                    localStorage.removeItem('token');
                    this.productList = [];
                }
            }
        ).catch(
            err => {
                this.alertS.error(this.alertContainer, err.error.error, true, 300);
            }
        )
    }

    addToCart() {
        const token = localStorage.getItem('token');
        this.cartItem.token = token ? token : '';

        this.cartS.addtoCart(this.cartItem).then(
            res => {
                if (res.success === true) {
                    $("#myForm").trigger("reset");
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
                this.alertS.error(this.alertContainer, 'Medicine has not been added to cart', true, 300);
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
                return this.getMedicineList(term);
            }),
        );
    };

    private getMedicineList(params): any {
        if (!params && params === '') {
            this.loader_sub = false;
            return [];
        }
        const search = 'search=' + params.trim();
        return this.cartS.searchProduct(search).pipe(
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

    getSettings() {
        Helpers.loadStyles('head', 'assets/css/select2.min.css');
        Helpers.loadStyles('head', 'assets/css/jquery-ui.custom.min.css');
        Helpers.loadStyles('head', 'assets/css/chosen.min.css');
        Helpers.loadStyles('head', 'assets/css/bootstrap-datepicker3.min.css');
        Helpers.loadStyles('head', 'assets/css/bootstrap-timepicker.min.css');
        Helpers.loadStyles('head', 'assets/css/daterangepicker.min.css');
        Helpers.loadStyles('head', 'assets/css/bootstrap-datetimepicker.min.css');
        Helpers.loadStyles('head', 'assets/css/bootstrap-colorpicker.min.css');
        Helpers.loadStyles('head', 'assets/css/custom.css');
        this._script.loadScripts('body', [
            'assets/js/jquery-2.1.4.min.js',
            'assets/js/select2.min.js',
            'assets/js/chosen.jquery.min.js',
            'assets/js/spinbox.min.js',
            'assets/js/bootstrap-datepicker.min.js',
            'assets/js/bootstrap-timepicker.min.js',
            'assets/js/moment.min.js',
            'assets/js/daterangepicker.min.js',
            'assets/js/bootstrap-datetimepicker.min.js',
            'assets/js/bootstrap-colorpicker.min.js',
            'assets/js/jquery.knob.min.js',
            'assets/js/autosize.min.js',
            'assets/js/jquery.inputlimiter.min.js',
            'assets/js/jquery.maskedinput.min.js',
            'assets/js/bootstrap-tag.min.js',
            'assets/js/custom.js',
        ])
            .then(result => {
                // Helpers.setLoading(false);
            });


    }
}
