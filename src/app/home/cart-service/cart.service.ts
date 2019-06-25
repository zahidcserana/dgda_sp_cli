import { Injectable, Optional, EventEmitter } from '@angular/core';
import { CartServiceConfig, CartItem } from './cart.model';
import { BehaviorSubject, Observer, of } from 'rxjs';
import { HttpService } from '../../modules/http-with-injector/http.service';
import { map, catchError } from 'rxjs/operators';
import { FormatPrice, FormateAttribute, GET_USER, isJson, GETTIME, singleOrNot } from '../../globals/_classes/functions';
import {AuthService} from '../../auth/auth.service';
export interface CartDiscountConfig {
    reload: boolean;
    cart?: any;
}

declare let $: any;
export interface CartviewSubjectConfig {
    reload?: boolean;
    items?: CartItem[];
}

@Injectable()
export class CartService {

    /** add to cart */

    private cartsubject: CartviewSubjectConfig = { reload: false };
    cartReload = new BehaviorSubject(this.cartsubject);

    addtoCart(data: any) {
        return this.http.post("carts/add-to-cart", data).toPromise();
    }

    saveCartsInlocalStorage(data) {
        localStorage.setItem("user_cart", JSON.stringify(data));
    }


    /** *** *** *** */
    config: CartServiceConfig;
    private discountSubject: CartDiscountConfig = { reload: false };
    cartDiscount = new BehaviorSubject(this.discountSubject);
    private CARTCOUNT = new BehaviorSubject<any>(null);
    cartNo = this.CARTCOUNT.asObservable();

    reloadInventory = new BehaviorSubject(null);

    private ProductId = new BehaviorSubject<any>(null);
    getId = this.ProductId.asObservable();

    private CHECKOUT = new BehaviorSubject<any>(false);
    checkout = this.CHECKOUT.asObservable();

    private PAYMENT = new BehaviorSubject<any>(false);
    payment = this.PAYMENT.asObservable();


    private LOC = new BehaviorSubject<any>(null);
    location = this.LOC.asObservable();

    private BOLT = new BehaviorSubject<any>(null);
    boltOn = this.BOLT.asObservable();

    reloadCalander: EventEmitter<boolean> = new EventEmitter();

    cartNoChange(data) {
        this.CARTCOUNT.next(data);
    }

    getProductId(data) {
        this.ProductId.next(data);
    }

    goToCheckOut(data) {
        this.CHECKOUT.next(data);
    }

    goToPayment(data) {
        this.PAYMENT.next(data);
    }

    changeLoc(data) {
        this.LOC.next(data);
    }

    cancelBoltTerminal(data) {
        this.BOLT.next(data);
    }

    constructor(
        @Optional() config: CartServiceConfig,
        private http: HttpService,
        private authS: AuthService
    ) {
        this.config = config;
    }

    datePicker(date) {
        $('#Rental-time-cart').timepicker({
            defaultTime: GETTIME(date),
            minuteStep: 1,
            showSeconds: false,
            showMeridian: true,
            snapToStep: true
        });
        $('#Renterl-date-cart').datepicker({
            todayHighlight: true,
            orientation: "bottom right",
            format: 'yyyy-mm-dd',
            templates: {
                leftArrow: '<i class="la la-angle-left"></i>',
                rightArrow: '<i class="la la-angle-right"></i>'
            },
            startDate: new Date()
        });
        $("#Renterl-date-cart").datepicker("setDate", date);
    }

    private formateData(data, prop) {
        for (let d of data) {
            d['text'] = d[prop];
        }
        return data;
    }

    formatePrice(data) {
        if (data && data.length > 0) {
            return FormatPrice(data);
        }
        return { base: {}, rent: [] };
    }

    formateAttribute(data) {
        return FormateAttribute(data);
    }

    getCurrentDateTime(date) {
        let obj = { date: '', time: '' };
        obj['date'] = date.getFullYear() + '-' + (date.getMonth() + 1) + '-' + date.getDate();
        obj['time'] = date.getHours() + ':' + date.getMinutes();
        return obj;
    }

    formateDate(data) {
        if (data) {
            return data.date + ' ' + data.time;
        }
        return null;
    }

    formateListDate(d) {
        if (d) {
            return new Date(d);
        }
        return '';
    }

    formatUpdateCart(item) {
        const data = new CartItem();
        const prop = ['id','token','product_id','price','quantity','rent_start','rental_duration','rental_type','term','sales_tax',
            'deposit_amount','deposite_tax','driving_license_required','variants_products_id', 'location'];
        for( const key of prop) {
            data[key] = item[key] ? item[key] : '';
        }
        return data;
    }

    getSessionData(name) {
        const data = sessionStorage.getItem(name);
        return data && isJson(data) ? JSON.parse(data) : null;
    }

    setSessionData(name, data) {
        sessionStorage.setItem(name, JSON.stringify(data));
    }

    removeSessionData(name) {
        sessionStorage.removeItem(name);
    }

    getAvailableQty(pro, attr, proQty, list, sd?, dur?, edit?: boolean, i?: number) {
        const qty = pro.products_availabilities.filter((d) => {
            return this.checkDate(d.start_date, d.end_date, sd, dur);
        }).map((q) => {
            return q.quantity;
        }).reduce((t, i) => {
            return t + i;
        }, 0);
        let quant = proQty - qty;

        let prod = list.filter((p) => {
            return attr.attributes_products_id == p.attributes_products_id;
        });

        for (let q of prod) {
            quant = quant - q.quantity;
        }

        if (edit) {
            quant = quant + list[i].quantity;
        }

        return quant < 0 ? 0 : quant;
    }

    checkDate(s, e, i, d) {
        let date = new Date();
        if (i) {
            date = new Date(i);
        }
        let cur = new Date(date.getFullYear(), date.getMonth(), date.getDate(), 12, 0).getTime();
        let curEnd = cur + (86400000 * (d - 1));
        // console.log(new Date(curEnd), d);
        let st = new Date(new Date(s).getFullYear(), new Date(s).getMonth(), new Date(s).getDate(), 0, 0).getTime();
        let end = new Date(new Date(e).getFullYear(), new Date(e).getMonth(), new Date(e).getDate(), 23, 59).getTime();
        return ((st <= cur) && (end >= cur)) || (end > cur && st < curEnd);
    }

    formateSearchList(data) {
        const perId = $('.admin-cart .dropdown-menu.show').attr('id');
        var c = document.getElementById(perId).children;
        //   console.log(c.length, data.length);
        for (let j = 0; j < data.length; j++) {
            var id = c[j].getAttribute('id');
            console.log('id');
            console.log(id);
            var original = document.getElementById(id);
            // Create a replacement tag of the desired type
            var replacement = document.createElement('div');

            // Grab all of the original's attributes, and pass them to the replacement
            for (var i = 0, l = original.attributes.length; i < l; ++i) {
                var nodeName = original.attributes[i].name;
                var nodeValue = original.attributes[i].value;
                if (nodeName != 'type') {
                    replacement.setAttribute(nodeName, nodeValue);
                }
            }

            // Persist contents
            const r = data[j];
            // console.log(r);
            const chain = `<div class="colorPurpel"><small style="font-style: italic">${r.chain}</small></div>`;
            const buy = `<button class="btn btn-sm btn-xsm btn-outline-dark buy-search" data-attr="${r.variants_products_id}" style="margin-right: 10px;">Buy</button>`;
            const rent = `<button class="btn btn-sm btn-xsm btn-outline-danger rent-search" data-attr="${r.variants_products_id}">Rent</button>`;
            const notAdded = `<small>(Price not added)</small>`
            replacement.innerHTML = `<div>${r.brand_name}</div>${r.generic_name ? chain : ''}`;

            original.parentNode.replaceChild(replacement, original);
        }
    }

    findAttrProId(data, attr) {
        return data.find((f) => f.variants_products_id == attr);
    }

    getMonth() {
        return [
            { text: '-Select Month-', value: null },
            { text: '01 January', value: '01' },
            { text: '02 February', value: '02' },
            { text: '03 March', value: '03' },
            { text: '04 April', value: '04' },
            { text: '05 May', value: '05' },
            { text: '06 June', value: '06' },
            { text: '07 July', value: '07' },
            { text: '08 August ', value: '08' },
            { text: '09 September ', value: '09' },
            { text: '10 October ', value: '10' },
            { text: '11 November', value: '11' },
            { text: '12 December', value: '12' },
        ]
    }

    getYears() {
        let y = new Date().getFullYear();
        let arr = [];
        arr.push({ text: '-Select Year-', value: null });
        for (let i = 0; i < 15; i++) {
            let obj = {};
            obj['text'] = y + i;
            obj['value'] = (y + i).toLocaleString().slice(-2);
            arr.push(obj);
        }
        return arr;
    }

    checkBuy() {
        const cart = this.getSessionData('cartList');
        for (let c of cart) {
            if (c.rental_type != 'buy') {
                return false;
            }
        }
        return true;
    }

    // Api integration

    getShipping() {
        return this.http.get(`stores/delivery-settings`).pipe(map(res => res.result), catchError(err =>  of(null))).toPromise();
    }

     searchProduct(search) {
        const loc = GET_USER().location_id;
        return this.http.get(`medicines/search?${search}`);
    }

    getProduct(attr_id) {
        return this.http.get(`products/view/variant-product/${attr_id}`).pipe(map( res => res.result));
    }

    addCart(data) {
        return this.http.post('carts/add-to-cart', data).toPromise();
    }

    deleteCart(cart, token) {
        return this.http.post('carts/cart-remove-item', { token: token, cart_id: cart.cart_id, cart_item_id: cart.id, product_id: cart.product_id}).toPromise();
    }

    addPayment(paymnet) {
        return this.http.post('orders', paymnet).toPromise();
    }

    updateCart(data) {
        return this.http.post('carts/update', data).toPromise();
    }

    applyCoupon(code) {
        return this.http.post('carts/apply-coupon', code).pipe(map(res => res));
    }

    getCreditCardSwipe(data) {
        return this.http.post('orders/bolt-card-connect', data).pipe(map(res => res.result));
    }

    deleteAllCart(id) {
        return this.http.delete(`carts/${id}`).pipe(map(res => res.result));
    }

    printReceipt(data) {
        return this.http.post(`orders/print-receipt`, data).pipe(map(res => res.result));
    }

    getterminals() {
        return this.http.get(`locations`).pipe(map(res => res));
    }

    sendStoreData(data) {
        return this.http.post('locations/choose', data).toPromise();
    }

    sendterminData(data) {
        return this.http.post('terminals/choose', data).toPromise();
    }

    cancelBolt(data) {
        return this.http.post('orders/cancel', data).toPromise();
    }

    addShipping(data) {
        return this.http.post('orders/delivery-cost', data).toPromise();
    }

    getGateways() {
        return this.http.get(`payments/gateway`).pipe(map (m => m.result.data), catchError ( err => of([])));
    }

    getShippingList() {
        return this.http.get(`shipping-carrier-list`).pipe(map(res => res.result.data), catchError( e => of([])));
    }


}
