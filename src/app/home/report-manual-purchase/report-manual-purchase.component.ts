import {Component, OnInit} from '@angular/core';
import {PurchaseModel} from '../report-models/purchase.model';
import {PurchaseService} from './purchase-service/purchase.service';

@Component({
    selector: 'app-report-manual-purchase',
    templateUrl: './report-manual-purchase.component.html',
    styleUrls: ['./report-manual-purchase.component.css']
})
export class ReportManualPurchaseComponent implements OnInit {
    purchaseItemList: PurchaseModel[] = [];
    loader: boolean;

    constructor(
        private purchaseS: PurchaseService
    ) {
        this.getManualPurchaseList();
    }

    ngOnInit() {

    }

    getManualPurchaseList() {
        this.loader = true;
        const q = '';
        this.purchaseS.getAllManualPurchase(1, 100, q).subscribe(
            res => {
                this.purchaseItemList = res.data;
                console.log(this.purchaseItemList);
            }
        );
    }
}
