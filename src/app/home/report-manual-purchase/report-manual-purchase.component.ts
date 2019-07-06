import {Component, OnInit} from '@angular/core';
import {PurchaseModel} from '../report-models/purchase.model';
import {PurchaseService} from './purchase-service/purchase.service';
import * as $ from 'jquery';
import {Helpers} from '../../helpers';
import {ScriptLoaderService} from '../../_services/script-loader.service';

@Component({
    selector: 'app-report-manual-purchase',
    templateUrl: './report-manual-purchase.component.html',
    styleUrls: ['./report-manual-purchase.component.css']
})
export class ReportManualPurchaseComponent implements OnInit {
    purchaseItemList: PurchaseModel[] = [];
    loader: boolean;

    constructor(
        private _script: ScriptLoaderService,
        private purchaseS: PurchaseService
    ) {
        this.getManualPurchaseList();
        this.getSettings();
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

    getSettings() {
        Helpers.loadStyles('head', 'https://cdn.datatables.net/1.10.19/css/jquery.dataTables.min.css');
        this._script.loadScripts('body', [
            'https://cdn.datatables.net/1.10.19/js/jquery.dataTables.min.js'
        ])
            .then(result => {
                // Helpers.setLoading(false);
            });
    }
}
