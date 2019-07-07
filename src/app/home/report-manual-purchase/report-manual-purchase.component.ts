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
    }

    ngOnInit() {
        this.getSettings();

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

    checkStatus(s) {
        return this.purchaseS.checkStatus(s);
    }

    getStatus(s) {
        return this.purchaseS.getStatus(s);
    }

    getSettings() {
        Helpers.loadStyles('head', 'assets/css/bootstrap.min.css');
        this._script.loadScripts('body', [
            'assets/js/jquery-2.1.4.min.js',
            'assets/js/ace-elements.min.js',
            'assets/js/wizard.min.js'
        ])
            .then(result => {
                // Helpers.setLoading(false);
            });
    }
}
