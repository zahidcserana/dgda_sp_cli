import {Component, OnInit} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {Observable, Subscription} from 'rxjs';
import {debounceTime, distinctUntilChanged, map} from 'rxjs/operators';

@Component({
    selector: 'app-manual-purchase',
    templateUrl: './manual-purchase.component.html',
    styleUrls: ['./manual-purchase.component.css']
})
export class ManualPurchaseComponent implements OnInit {
    companyList: any[] = [];
    sub: Subscription;

    constructor(private route: ActivatedRoute) {

    }

    ngOnInit() {
        this.sub = this.route.data.subscribe(
            val => {
                this.companyList = val && val['companies'] ? val['companies'] : [];
                console.log(this.companyList);
            }
        );
    }
    company_search = (company$: Observable<string>) =>
        company$.pipe(
            debounceTime(200),
            distinctUntilChanged(),
            map(term => term.length < 2 ? []
                : this.companyList.filter(v => v.toLowerCase().indexOf(term.toLowerCase()) > -1).slice(0, 10))
        )
    makeOrder() {

    }
}
