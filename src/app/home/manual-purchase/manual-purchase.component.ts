import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {Observable, Subscription} from 'rxjs';
import {catchError, debounceTime, distinctUntilChanged, map, switchMap, tap} from 'rxjs/operators';
import {FormArray, FormBuilder, FormControl, FormGroup} from '@angular/forms';
import {CartService} from '../cart-service/cart.service';
import {AlertService} from '../../modules/alert/alert.service';
import * as $ from 'jquery';

@Component({
    selector: 'app-manual-purchase',
    templateUrl: './manual-purchase.component.html',
    styleUrls: ['./manual-purchase.component.css']
})
export class ManualPurchaseComponent implements OnInit {
    companyList: any[] = [];
    sub: Subscription;
    searchData: any[] = [];

    medicineSearch: any = {
        company: '',
        search: ''
    };
    manualOrder: any = {
        company: '',
        company_invoice: '',
        discount: '',
        purchase_date: '',
        items: []
    };

    form = new FormGroup({
        medicines: new FormArray([
            new FormControl(),
        ]),
        batches: new FormArray([
            new FormControl(),
        ]),
        quantities: new FormArray([
            new FormControl(),
        ]),
        vats: new FormArray([
            new FormControl(),
        ]),
        powers: new FormArray([
            new FormControl(),
        ]),
        totals: new FormArray([
            new FormControl(),
        ]),
    });
    @ViewChild('hasAlert') alertContainer: ElementRef;

    constructor(
        private route: ActivatedRoute,
        private formBuilder: FormBuilder,
        private router: Router,
        private cartS: CartService,
        private alertS: AlertService
    ) {

    }

    get medicines(): FormArray {
        return this.form.get('medicines') as FormArray;
    }

    get batches(): FormArray {
        return this.form.get('batches') as FormArray;
    }

    get quantities(): FormArray {
        return this.form.get('quantities') as FormArray;
    }

    get vats(): FormArray {
        return this.form.get('vats') as FormArray;
    }

    get totals(): FormArray {
        return this.form.get('totals') as FormArray;
    }

    get powers(): FormArray {
        return this.form.get('powers') as FormArray;
    }

    addItem() {
        this.medicines.push(new FormControl());
        this.batches.push(new FormControl());
        this.quantities.push(new FormControl());
        this.vats.push(new FormControl());
        this.totals.push(new FormControl());
        this.powers.push(new FormControl());
    }

    onSubmit() {
        console.log(this.form.value);
        this.manualOrder.items = this.form.value;
        this.cartS.manualOrder(this.manualOrder).then(
            res => {
                if (res.success === true) {
                    this.alertS.success(this.alertContainer, 'Orders successfully submitted.', true, 3000);
                    $('#myForm').trigger('reset');
                } else {
                    this.alertS.error(this.alertContainer, res.error, true, 3000);
                }
            }
        ).catch(
            err => {
                console.log(err);
                this.alertS.error(this.alertContainer, err.error.error, true, 3000);
            }
        );
    }

    ngOnInit() {
        this.sub = this.route.data.subscribe(
            val => {
                this.companyList = val && val['companies'] ? val['companies'] : [];
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
                // this.searchData = [];
                // this.loader_sub = true;
            }),
            switchMap(term => {
                // this.loader_sub = true;
                this.medicineSearch.company = this.manualOrder.company;
                this.medicineSearch.search = term.trim();

                return this.getMedicineList(this.medicineSearch);
            }),
        );
    };

    private getMedicineList(params): any {
        if (!params && params === '') {
            // this.loader_sub = false;
            return [];
        }

        return this.cartS.searchMedicine(params).pipe(
            map(res => {
                // this.loader_sub = false;
                this.searchData = res;
                return this.searchData;
            }),
            catchError(() => {
                // this.loader_sub = false;
                return [];
            })
        );
    }

}
